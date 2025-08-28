import { Router } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const router = Router();

const CreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).optional()
});

const UpdateSchema = CreateSchema.partial();

const toCSV = (tags?: string[]) => (tags && tags.length ? tags.join(",") : "");
const fromCSV = (csv: string) => (csv ? csv.split(",").map(s => s.trim()).filter(Boolean) : []);

// CREATE
router.post("/", async (req, res) => {
  const parsed = CreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const created = await prisma.resource.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      tags: toCSV(parsed.data.tags)
    }
  });

  res.status(201).json({ ...created, tags: fromCSV(created.tags) });
});

// LIST
router.get("/", async (req, res) => {
  const q = (req.query.q as string) || "";
  const tag = (req.query.tag as string) || "";
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const offset = Number(req.query.offset || 0);

  const where = {
    AND: [
      q ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } }
        ]
      } : {},
      tag ? { tags: { contains: tag, mode: "insensitive" } } : {}
    ]
  };

  const [items, total] = await Promise.all([
    prisma.resource.findMany({ where, skip: offset, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.resource.count({ where })
  ]);

  res.json({
    total,
    limit,
    offset,
    items: items.map(r => ({ ...r, tags: fromCSV(r.tags) }))
  });
});

// GET one
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const row = await prisma.resource.findUnique({ where: { id } });
  if (!row) return res.status(404).json({ message: "Not found" });
  res.json({ ...row, tags: fromCSV(row.tags) });
});

// UPDATE
router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const data: any = {};
  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.description !== undefined) data.description = parsed.data.description;
  if (parsed.data.tags !== undefined) data.tags = toCSV(parsed.data.tags);

  try {
    const updated = await prisma.resource.update({ where: { id }, data });
    res.json({ ...updated, tags: fromCSV(updated.tags) });
  } catch {
    res.status(404).json({ message: "Not found" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.resource.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: "Not found" });
  }
});

export default router;

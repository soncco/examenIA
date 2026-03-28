import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { ExamResult } from '@/lib/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'results.json');

async function readResults(): Promise<ExamResult[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as ExamResult[];
  } catch {
    return [];
  }
}

async function writeResults(results: ExamResult[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(results, null, 2), 'utf-8');
}

/** Devuelve todos los resultados — solo el docente lo usa */
export async function GET() {
  const results = await readResults();
  return NextResponse.json(results);
}

/** Guarda el resultado de un alumno */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const results = await readResults();
  const newResult: ExamResult = { id: crypto.randomUUID(), ...body };
  results.push(newResult);
  await writeResults(results);
  return NextResponse.json(newResult, { status: 201 });
}

/** Borra todos los resultados */
export async function DELETE() {
  await writeResults([]);
  return NextResponse.json({ ok: true });
}

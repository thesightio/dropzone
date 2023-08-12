// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';

const CITIES = [
  "Челябинск",
  "Мурманск",
  "Киров",
  "Новосибиск",
  "Москва",
];

export function GET(
  _: NextRequest,
) {
  const city = CITIES[Math.floor(Math.random()*CITIES.length)];
  return NextResponse.json({ city })
}

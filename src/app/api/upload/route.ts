import { v4 as uuid4 } from "uuid";
import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  let data: FormData
  try {
    data = await request.formData()
  } catch (e) {
    return NextResponse.json({ message: "No file specified." }, {status: 400 })
  }
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ message: "No file specified." }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const name = `${uuid4()}.${file.name.split('.')[1]}`
  const path = `${process.cwd()}/public/media/${name}`
  await writeFile(path, buffer)

  return NextResponse.json({ url: `/media/${name}` })
}

import fs from 'fs/promises';
import path from 'path';

export async function readTextFile(filePath) {
  if (!filePath) {
    console.error('No file path provided');
    return '';
  }

  try {
    const resolvedPath = path.resolve(filePath);
    const fileContent = await fs.readFile(resolvedPath, 'utf-8');
    
    return fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}
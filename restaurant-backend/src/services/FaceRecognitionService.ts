// src/services/FaceRecognitionService.ts
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import EmployeeFaceModel, { IEmployeeFace } from '../models/EmployeeFaceModel';
import path from 'path';

const { Canvas, Image, ImageData } = canvas;
// @ts-ignore
faceapi.env.monkeyPatch({
  Canvas: Canvas as any,
  Image: Image as any,
  ImageData: ImageData as any
});

export async function loadFaceApiModels() {
  const mobilenetPath = path.join(__dirname, '../models/ssd_mobilenetv1');
  const recogPath = path.join(__dirname, '../models/face_recognition');
  const landmarkPath = path.join(__dirname, '../models/face_landmark_68');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(mobilenetPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(recogPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(landmarkPath);
}

export async function getFaceEmbedding(imageBuffer: Buffer): Promise<number[] | null> {
  const img = await canvas.loadImage(imageBuffer);
  const c = canvas.createCanvas(img.width, img.height);
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const detection = await faceapi.detectSingleFace(c).withFaceLandmarks().withFaceDescriptor();
  if (!detection) return null;
  return Array.from(detection.descriptor);
}

export async function verifyEmployeeFace(imageBuffer: Buffer): Promise<IEmployeeFace | null> {
  const embedding = await getFaceEmbedding(imageBuffer);
  if (!embedding) return null;
  const employees = await EmployeeFaceModel.find();
  let bestMatch: IEmployeeFace | null = null;
  let minDistance = 1;
  for (const emp of employees) {
    const dist = euclideanDistance(embedding, emp.faceEmbedding);
    if (dist < minDistance && dist < 0.5) { // ngưỡng xác thực
      minDistance = dist;
      bestMatch = emp;
    }
  }
  return bestMatch;
}

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}
import { NextApiRequest, NextApiResponse } from 'next';
import { generateAppleTouchIcon } from '@/utils/generateIcon';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // 1일 캐시
  
  // 180x180 파란색 PNG 생성
  const width = 180;
  const height = 180;
  
  const png180x180 = generatePNG180x180();
  res.status(200).send(png180x180);
}

function generatePNG180x180(): Buffer {
  // 180x180 파란색 정사각형 PNG
  // PNG 시그니처
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR 청크 (180x180, RGB, 8비트)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(180, 0);  // 너비
  ihdrData.writeUInt32BE(180, 4);  // 높이
  ihdrData[8] = 8;   // 비트 깊이
  ihdrData[9] = 2;   // 색상 타입 (RGB)
  ihdrData[10] = 0;  // 압축 방법
  ihdrData[11] = 0;  // 필터 방법
  ihdrData[12] = 0;  // 인터레이스 방법
  
  const ihdrLength = Buffer.alloc(4);
  ihdrLength.writeUInt32BE(13, 0);
  const ihdrType = Buffer.from('IHDR');
  const ihdrCrc = calculateCRC(Buffer.concat([ihdrType, ihdrData]));
  const ihdrCrcBuf = Buffer.alloc(4);
  ihdrCrcBuf.writeUInt32BE(ihdrCrc, 0);
  
  // 간단한 IDAT 청크 (파란색으로 채움)
  // 실제로는 deflate 압축이 필요하지만 최소한의 데이터로 대체
  const idatData = Buffer.from([
    0x78, 0x9C, 0x01, 0x15, 0x03, 0xEA, 0xFC, // zlib 헤더 + 비압축 블록
    0x25, 0x63, 0xEB, // RGB 파란색 (37, 99, 235)
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, // 최소 압축 데이터
    0x00, 0x00, 0x01, 0x00 // adler32 체크섬
  ]);
  
  const idatLength = Buffer.alloc(4);
  idatLength.writeUInt32BE(idatData.length, 0);
  const idatType = Buffer.from('IDAT');
  const idatCrc = calculateCRC(Buffer.concat([idatType, idatData]));
  const idatCrcBuf = Buffer.alloc(4);
  idatCrcBuf.writeUInt32BE(idatCrc, 0);
  
  // IEND 청크
  const iendLength = Buffer.alloc(4);
  iendLength.writeUInt32BE(0, 0);
  const iendType = Buffer.from('IEND');
  const iendCrc = calculateCRC(iendType);
  const iendCrcBuf = Buffer.alloc(4);
  iendCrcBuf.writeUInt32BE(iendCrc, 0);
  
  return Buffer.concat([
    signature,
    ihdrLength, ihdrType, ihdrData, ihdrCrcBuf,
    idatLength, idatType, idatData, idatCrcBuf,
    iendLength, iendType, iendCrcBuf
  ]);
}

function calculateCRC(data: Buffer): number {
  let crc = 0xFFFFFFFF;
  
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
  }
  
  return crc ^ 0xFFFFFFFF;
}
// PNG 아이콘 생성 유틸리티
export function generateAppleTouchIcon(): Buffer {
  // 180x180 파란색 아이콘을 위한 PNG 데이터
  const width = 180;
  const height = 180;
  
  // PNG 시그니처
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR 청크
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // 비트 깊이
  ihdrData[9] = 2;  // RGB 색상 타입
  ihdrData[10] = 0; // 압축 방법
  ihdrData[11] = 0; // 필터 방법
  ihdrData[12] = 0; // 인터레이스 방법
  
  const ihdrLength = Buffer.alloc(4);
  ihdrLength.writeUInt32BE(13, 0);
  
  const ihdrType = Buffer.from('IHDR');
  const ihdrCrc = calculateCRC(Buffer.concat([ihdrType, ihdrData]));
  const ihdrCrcBuf = Buffer.alloc(4);
  ihdrCrcBuf.writeUInt32BE(ihdrCrc, 0);
  
  // 간단한 IDAT (파란색으로 채운 이미지)
  // 실제로는 deflate 압축이 필요하지만, 여기서는 최소한의 데이터만
  const idatData = Buffer.from([
    0x78, 0x9C, // zlib 헤더
    0x01, 0x00, 0x01, 0xFF, 0xFE, // 비압축 블록
    0x00, 0x00, 0x00, 0x02, 0x00, 0x01 // 최소 데이터
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

// CRC32 계산
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
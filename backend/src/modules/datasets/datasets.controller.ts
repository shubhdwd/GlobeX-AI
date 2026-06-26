import { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../../utils/logger';

// Helper to format bytes
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const listDatasets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    let files: string[] = [];
    
    try {
      files = await fs.readdir(dataDir);
    } catch (err) {
      logger.error('Failed to read data directory', err);
      // If directory doesn't exist or is unreadable, just return empty list
      return res.status(200).json({ success: true, data: [] });
    }

    // Filter to show only files that might be datasets (CSV, XLS, XLSX)
    const datasetFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.csv', '.xls', '.xlsx'].includes(ext);
    });

    const datasets = await Promise.all(
      datasetFiles.map(async (file, index) => {
        const filePath = path.join(dataDir, file);
        const stats = await fs.stat(filePath);
        
        return {
          id: index + 1,
          name: file,
          size: formatBytes(stats.size),
          sizeBytes: stats.size,
          // We don't read full rows for large files like 1.2GB here
          rows: 'Estimating...',
          date: stats.mtime.toISOString().split('T')[0],
          status: 'Active',
        };
      })
    );

    res.status(200).json({
      success: true,
      data: datasets,
    });
  } catch (error) {
    next(error);
  }
};

import { Injectable } from '@nestjs/common';
import { promises as fsPromises, existsSync } from 'fs';
import { join, dirname } from 'path';

@Injectable()
export class LoggingService {
  private readonly LOG_DIR = join(__dirname, '../../logs');
  private readonly LOG_FILE = join(this.LOG_DIR, 'all.log'); // Single log file
  private readonly MAX_LOG_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

  private async ensureLogFileExists() {
    if (!existsSync(this.LOG_DIR)) {
      await fsPromises.mkdir(this.LOG_DIR, { recursive: true });
    }
    // Create an empty log file if it doesn't exist
    if (!existsSync(this.LOG_FILE)) {
      await fsPromises.writeFile(this.LOG_FILE, '');
    }
  }

  private async rotateLogFile() {
    const currentLogSize = (await fsPromises.stat(this.LOG_FILE)).size;
    if (currentLogSize >= this.MAX_LOG_SIZE_BYTES) {
      const timestamp = new Date().toISOString().replace(/:/g, '-'); // Remove colons for filename
      const newLogFileName = `all_${timestamp}.log`;

      // Rename current log file
      await fsPromises.rename(this.LOG_FILE, join(this.LOG_DIR, newLogFileName));

      // Create new empty log file
      await fsPromises.writeFile(this.LOG_FILE, '');
    }
  }

  private async writeLog(data: Record<string, any>) {
    try {
      await this.ensureLogFileExists();
      await this.rotateLogFile();
      await fsPromises.appendFile(this.LOG_FILE, JSON.stringify(data, null, 2) + '\n');
    } catch (error) {
      console.error('Error writing log file:', error);
    }
  }

  log(message: any) {
    this.writeLog(message);
  }
}

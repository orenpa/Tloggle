export class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
        // console.log(`Logger initialized for ${context}`);
    }

    info(message: string, data?: any) {
        console.log(`[${this.context}] ${message}`, data);
    }

    // console.log('This is outside the class');
    
    error(message: string, error?: Error) {
        console.error(`[${this.context}] Error: ${message}`, error);
    }

    warn(message: string) {
        console.warn(`[${this.context}] Warning: ${message}`);
        // console.warn('This warning is commented out');
    }
} 
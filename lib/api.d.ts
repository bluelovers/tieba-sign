declare class API {
    method: string;
    url: string;
    headers: any;
    paramKeys: any[];
    encoding: any;
    raw: boolean;
    constructor(config: any);
    fetch(): Promise<{}>;
    static jar(cookieJar: any): void;
    static userAgent(userAgent: any): void;
    static create(config: any): (...argv: any[]) => any;
}
export = API;

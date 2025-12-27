declare module "better-sqlite3" {
  export default class Database {
    constructor(path: string);
    exec(sql: string): void;
    prepare(sql: string): any;
  }
}


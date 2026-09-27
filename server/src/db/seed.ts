import type { SqliteDatabase } from "./connection";
import type { ILogger } from "../logging/logger";
import { FIRST_NAMES, HOBBIES, LAST_NAMES, NATIONALITIES } from "./seed-data";

function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

function pickUnique<T>(items: T[], count: number, random: () => number): T[] {
  const pool = [...items];
  const selected: T[] = [];

  while (selected.length < count && pool.length > 0) {
    const index = Math.floor(random() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }

  return selected;
}

export function isDatabaseSeeded(db: SqliteDatabase): boolean {
  const row = db.prepare("SELECT COUNT(*) AS count FROM users").get() as { count: number };
  return row.count > 0;
}

export function seedDatabase(
  db: SqliteDatabase,
  userCount: number,
  logger: ILogger,
): void {
  if (isDatabaseSeeded(db)) {
    logger.info("Database already seeded, skipping");
    return;
  }

  const random = createRng(20260918);
  const insertHobby = db.prepare("INSERT INTO hobbies (name) VALUES (?)");
  const insertUser = db.prepare(`
    INSERT INTO users (id, avatar, first_name, last_name, age, nationality)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertUserHobby = db.prepare(
    "INSERT INTO user_hobbies (user_id, hobby_id) VALUES (?, ?)",
  );

  db.exec("BEGIN");
  try {
    const hobbyIds = HOBBIES.map((name) => Number(insertHobby.run(name).lastInsertRowid));

    for (let id = 1; id <= userCount; id += 1) {
      const firstName = pick(FIRST_NAMES, random);
      const lastName = pick(LAST_NAMES, random);
      const age = 18 + Math.floor(random() * 53);
      const nationality = pick(NATIONALITIES, random);
      const avatar = `https://i.pravatar.cc/128?u=${id}`;
      const hobbyCount = Math.floor(random() * 11);

      insertUser.run(id, avatar, firstName, lastName, age, nationality);

      for (const hobbyId of pickUnique(hobbyIds, hobbyCount, random)) {
        insertUserHobby.run(id, hobbyId);
      }
    }

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  logger.info("Database seeded", { userCount, hobbyCount: HOBBIES.length });
}

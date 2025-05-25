import { Selectable } from "kysely";
import ExamTable from "~/db/schemas/public/Exam";
import { ExamAttempt } from "~/db/schemas/public/ExamAttempt";
import ExamOption from "~/db/schemas/public/ExamOption";
import ExamQuestion from "~/db/schemas/public/ExamQuestion";

type DeepUnbrand<T> = T extends number & { __brand: any }
  ? number
  : T extends string & { __brand: any }
    ? string
    : T extends boolean & { __brand: any }
      ? boolean
      : T extends Date & { __brand: any }
        ? Date
        : T extends Date
          ? Date
          : T extends object
            ? { [K in keyof T]: DeepUnbrand<T[K]> }
            : T;

export type CleanExam = DeepUnbrand<Selectable<ExamTable>>;

export interface CleanExamWithName extends CleanExam {
  authorName: string;
}

export type CleanExamQuestion = DeepUnbrand<Selectable<ExamQuestion>>;

export type CleanExamOption = DeepUnbrand<Selectable<ExamOption>>;

export type CleanQuestionWithOptions = CleanExamQuestion & {
  options: CleanExamOption[];
};

export type CleanExamAttempt = DeepUnbrand<Selectable<ExamAttempt>>;

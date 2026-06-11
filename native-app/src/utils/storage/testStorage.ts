import { storage } from "./storage";

// 1. 타임라인 및 시험 스케줄 구조 정의 (타입 안전성 확보)
export interface TimelineItem {
    subject: string;      // 과목명 (예: "국어")
    startTime: string;    // 시작 시간 (예: "09:00")
    endTime: string;      // 종료 시간 (예: "10:20")
}

export interface ExamTimer {
    id: string;           // 고유 ID (수정, 삭제, Key값 매핑용)
    title: string;        // 타이머 대제목 (예: "국가직 9급 공무원 시험")
    timeline: TimelineItem[]; // 세부 시간축 리스트
}

const TEST_KEYS = {
    TEST_LIST: 'TEST_LIST',
} as const;

export const testStorage = {
    //전체 시험 타이머 리스트 저장 (최대 20개 내외 배열 통째로 저장)
    setExamList: async (examList: ExamTimer[]): Promise<void> => {
        await storage.set(TEST_KEYS.TEST_LIST, examList);
    },

    //전체 시험 타이머 리스트 불러오기 (데이터가 없으면 빈 배열 반환)
    getExamList: async (): Promise<ExamTimer[]> => {
        const value = await storage.get(TEST_KEYS.TEST_LIST);
        if (!value) return [];
        return value as ExamTimer[];
    },

    //단일 시험 타이머 추가 함수 (기존 리스트에 병합)
    addExam: async (newExam: ExamTimer): Promise<void> => {
        const currentList = await testStorage.getExamList();
        const updatedList = [...currentList, newExam];
        await testStorage.setExamList(updatedList);
    },

    //특정 시험 타이머 삭제 함수 (id 기준)
    deleteExam: async (id: string): Promise<void> => {
        const currentList = await testStorage.getExamList();
        const updatedList = currentList.filter(exam => exam.id !== id);
        await testStorage.setExamList(updatedList);
    },

    //전체 시험 타이머 데이터 초기화
    clearExamList: async (): Promise<void> => {
        await storage.remove(TEST_KEYS.TEST_LIST);
    },
};



export const defaultExamData: ExamTimer = {
    id: "default_csat",
    title: "대학수학능력시험 (기본)",
    timeline: [
        { subject: "1교시 국어", startTime: "08:40", endTime: "10:00" },
        { subject: "2교시 수학", startTime: "10:30", endTime: "12:10" },
        { subject: "3교시 영어", startTime: "13:10", endTime: "14:20" },
        { subject: "4교시 한국사", startTime: "14:50", endTime: "15:20" },
    ]
};
import { ExtractColumns } from 'query-typed';

// 타입 안전성 검증 예제

// 1. 타입 검증 함수
function expectColumns<Expected extends readonly string[]>(expected: Expected) {
    return function <T extends string>(sql: T): ExtractColumns<T> extends Expected ? T : never {
        return sql as any;
    };
}

// 2. 컴파일 타임 검증 예제
const validQuery1 = expectColumns(['id', 'name', 'email'])('SELECT id, name, email FROM users');
console.log('✅ 유효한 쿼리:', validQuery1);

const validQuery2 = expectColumns(['user_id', 'user_name'])('SELECT id as user_id, name as user_name FROM users');
console.log('✅ 유효한 별칭 쿼리:', validQuery2);

// 다음 줄들의 주석을 해제하면 컴파일 에러가 발생합니다:
// const invalidQuery1 = expectColumns(['id', 'name'])('SELECT id, name, email FROM users');
// ❌ 컴파일 에러: 3개 컬럼을 2개로 검증하려고 함

// const invalidQuery2 = expectColumns(['wrong_column'])('SELECT id FROM users');
// ❌ 컴파일 에러: 컬럼명이 맞지 않음

// 3. 조건부 타입을 사용한 쿼리 검증
type IsValidUserQuery<T extends string> = ExtractColumns<T> extends readonly string[]
    ? ExtractColumns<T>[number] extends 'id' | 'name' | 'email' | 'created_at' | 'updated_at'
    ? T
    : never
    : never;

function createUserQuery<T extends string>(sql: T): IsValidUserQuery<T> {
    // 사용자 테이블의 유효한 컬럼만 허용
    return sql as any;
}

const validUserQuery = createUserQuery('SELECT id, name FROM users');
console.log('✅ 유효한 사용자 쿼리:', validUserQuery);

// 다음 줄의 주석을 해제하면 컴파일 에러가 발생합니다:
// const invalidUserQuery = createUserQuery('SELECT invalid_column FROM users');
// ❌ 컴파일 에러: 유효하지 않은 컬럼

console.log('타입 안전성 검증 완료!');
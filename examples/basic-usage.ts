import { ExtractColumns, createTypedQuery, select } from 'query-typed';

// 컴파일 타임 타입 추론 예제
console.log('=== 컴파일 타임 타입 추론 ===');

// 타입만 추출 (실행 없이 컴파일 타임에 추론!)
type UserColumns = ExtractColumns<'SELECT id, name, email FROM users'>;
// UserColumns 타입: ["id", "name", "email"]

type AliasColumns = ExtractColumns<'SELECT id as user_id, name as user_name FROM users'>;
// AliasColumns 타입: ["user_id", "user_name"]

type AggColumns = ExtractColumns<'SELECT COUNT(*) as total, SUM(amount) as sum_amount FROM orders'>;
// AggColumns 타입: ["total", "sum_amount"]

// 타입 안전한 쿼리 생성
const typedQuery = createTypedQuery('SELECT id, name, email FROM users');
console.log('1. 타입 안전한 쿼리:', typedQuery.sql);
console.log('   컬럼 타입이 컴파일 타임에 추론됨: ["id", "name", "email"]');

// SELECT 쿼리 빌더
const selectQuery = select('SELECT id as user_id, name FROM users WHERE status = ?');
console.log('\n2. SELECT 쿼리 빌더:', selectQuery.sql);
console.log('   컬럼 타입이 컴파일 타임에 추론됨: ["user_id", "name"]');

// 타입 헬퍼 사용
function processUserData<T extends string>(sql: T) {
    type Columns = ExtractColumns<T>;
    console.log(`\n3. 쿼리 처리: ${sql}`);
    console.log('   추론된 컬럼 타입을 사용하여 타입 안전한 처리 가능');
    return null as any as Columns;
}

const userColumns = processUserData('SELECT id, name, created_at FROM users');
// userColumns의 타입: ["id", "name", "created_at"]

console.log('\n✅ 모든 타입 추론이 컴파일 타임에 완료되었습니다!');
console.log('🚀 런타임 의존성 없이 순수 TypeScript 타입만 사용합니다!');
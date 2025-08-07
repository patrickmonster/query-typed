cp dist/mjs/index.d.ts dist 

rm -rf dist/*/index.d.ts 

# ES 모듈용 .js 확장자 추가
sed -i '' "s/from '\.\//from '.\//" dist/mjs/index.js
sed -i '' "s/'\.\//'.\//" dist/mjs/index.js
sed -i '' "s/sql-types'/sql-types.js'/g" dist/mjs/index.js
sed -i '' "s/typed-sql'/typed-sql.js'/g" dist/mjs/index.js

cat >dist/cjs/package.json <<!EOF
{
    "type": "commonjs"
}
!EOF

cat >dist/mjs/package.json <<!EOF
{
    "type": "module"
}
!EOF
# playground

1. hello_api

   폴더:

   - hello-api-ts
   - hello-api-js

   기능:

   - return hello with query.name

   특징:

   - serverless 인프라 설정
   - 로깅(api gateway 포함), 지표 추적, 대시보드 확인

   ![화면 캡처 2023-09-28 152658](https://github.com/Louis-Gil/playground/assets/110698263/2cfa9829-2853-4efb-8708-d1f4d1df9ed7)

<hr>

2. photo_optimizer_api

   기능:

   - 사진 최적화
   - s3에 대량으로 올려도 이벤트 기반 최적화

   특징:

   - route53, acm을 활용하여 cdn https 접근
   - viewer protocal policy redirect http to https
   - use public & private store at s3 1 bucket
   - use s3 acclerate, lifeCyle, cache invalidation (\* 비용 절감 대안 필요)
   - event by s3 upload
   - upload exe with tar.gz
   - webpack config externals
   - use envrc with example

<hr>

3. sls_blog

   폴더:

   - sls-blog
   - sls-blog-front
   - sls-blog-cdn

   기능:

   - serverless lambda를 활용하여 간단한 crud기능

   특징:

   - blog-cdn으로 front 파일을 배포했으나 api-gateway를 활용하여 blog로 통합(staticHandler.ts 참고), sls domain
   - mysql example

   도전:

   - package individually 배포하여 메모리 부족현상 해결위해 ForkTsCheckerWebpackPlugin 사용
   - cloudfront domain 연결, acm 인증서 발급
   - sls plugin 순서에 따라 동작 안하는 현상

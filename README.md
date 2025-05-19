### Command

docker-compose up --build
docker-compose up --build -d
docker-compose down

Backend:
npm install
npm run dev

Frontned:
npm install
npm run dev

<!--
Đây là đăng nhập  
{
  "userName": "john_doe",
  "email": "johndoe@example.com",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123",
  "phone": 1234567890,
  "isAdmin": true,
  "isCashier": false
}
 -->
 <!-- 
https://accounts.google.com/o/oauth2/v2/auth?response_type=code
&client_id=562504444218-up7shkr6un8gcoiuu4h201vnj5ahdvfc.apps.googleusercontent.com
&redirect_uri=http://localhost:4000/api/auth/google/callback
&scope=email%20profile
&access_type=offline

thông tin khi gửi cho gg 
{
  "message": "Google login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NjhjZjc3NWJkODE1ODAxMmQ4ZDkyNiIsImlhdCI6MTczNDkyMjEwMywiZXhwIjoxNzM0OTI5MzAzfQ.RmXE3wUGfQXUWbdhQ6ghQj93evCT3CHpIfsiTrw4MPQ",
  "user": {
    "userName": "Mỹ Nguyễn Ngọc",
    "email": "nguyenngocmy1311@gmail.com",
    "avatar": "https://lh3.googleusercontent.com/a/ACg8ocJBu6Ud5phvQoaWRiefdJhnQudiC6ElSR08983QCUGNdzzPkPiZ=s96-c",
    "isAdmin": false,
    "isCashier": false,
    "googleId": "100566681651863679581",
    "_id": "6768cf775bd8158012d8d926",
    "createdAt": "2024-12-23T02:48:23.774Z",
    "updatedAt": "2024-12-23T02:48:23.774Z",
    "__v": 0
  }
}
test access token của gg 
https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=ya29.a0ARW5m75DY0birSwzZpps_yEhP5TCAV1PKNc7U8KptTjexW7M_6YYat3KMXl7jWXZCbpERo-x9kid4PE634tWAe3a9mOSy50wg3hgukrtNlXXkK6JdGwZ2Qxv66qYZ0ti4W-0SGDeTSOZJ2yeXbHfAhEhCLcOZw8YBFAaCgYKAZQSARESFQHGX2Mi991VG64mkr9DUVP3Gi18sw0170
test id token của gg 
https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjMxYjhmY2NiMmU1MjI1M2IxMzMxMzhhY2YwZTU2NjMyZjA5OTU3ZWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1NjI1MDQ0NDQyMTgtdXA3c2hrcjZ1bjhnY29pdXU0aDIwMXZuajVhaGR2ZmMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1NjI1MDQ0NDQyMTgtdXA3c2hrcjZ1bjhnY29pdXU0aDIwMXZuajVhaGR2ZmMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDA1NjY2ODE2NTE4NjM2Nzk1ODEiLCJlbWFpbCI6Im5ndXllbm5nb2NteTEzMTFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJMLUxYeUtRVHBZeUVXbDdfUDJMMkJRIiwibmFtZSI6Ik3hu7kgTmd1eeG7hW4gTmfhu41jIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pCdTZVZDVwaHZRb2FXUmllZmRKaG5RdWRpQzZFbFNSMDg5ODNRQ1VHTmR6elBrUGlaPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ik3hu7kiLCJmYW1pbHlfbmFtZSI6Ik5ndXnhu4VuIE5n4buNYyIsImlhdCI6MTczNDk1ODQ2NiwiZXhwIjoxNzM0OTYyMDY2fQ.bMtuaFa0xTunnmX3gR7KGatAcGz9oC7e5U-qGCUelMyDvrTAz8hdTxDqjP17lA7XeOdRfYWLW9gJYr_HjaOH0OgLGVZCVPD2IXQYoiHKyD-5RLwOHGVhF88gHu2zVaLUJOYvyHMa1gs2JSGVZR31WZo4uuxN18fV3OHlHEUetYwTMYAHIl9-HnaBKqCFBLsFSTXwxTzK1VG9xJPcyyzQoFWkCa26BCtdGYgRYoN_fEwr7ss7ymowzOJlre19v87S66tR7OdMtp_Lni84M9MYJ56gvOq6ggYQ-4WfNAUP31H0pGwUYX06pI4aPbHUTFcSsR5prsvKZT755fHw7ACsmw
  -->
  <!-- 
  https://www.facebook.com/v12.0/dialog/oauth?
  client_id={FACEBOOK_APP_ID}&
  redirect_uri={REDIRECT_URI}&
  response_type=code&
  scope=email,public_profile&
  state={STATE_PARAM}
=> dùng để xác thực và cấp quyền cho ứng dụng để có thể truy cập vào 
Chỉ cần copy link đây gửi lên gg 

https://www.facebook.com/v12.0/dialog/oauth?
client_id=1123946355863940&
redirect_uri=http://localhost:3003/api/auth/facebook/callback&
response_type=code&
scope=public_profile,email&
state=random_generated_string

https://www.facebook.com/v21.0/dialog/oauth?
client_id=1123946355863940&
redirect_uri=http://localhost:3003/api/auth/facebook/callback&
response_type=code&
scope=public_profile,email&
state=random_generated_string

https://developers.facebook.com/apps/1123946355863940/settings/basic/
   -->
<!-- 
Cách cài swagger yaml 
Bước 1: Cài đặt thư viện cần thiết 
npm install swagger-ui-express
npm install --save-dev @types/swagger-ui-express
Bước 2: Tạo cấu hình YAML 
Tạo một file swagger.yml trong thư mục chính của dự án hoặc một thư mục như src/config
openapi: 3.0.0
info:
  title: API Documentation
  description: API documentation for your project
  version: 1.0.0
servers:
  - url: http://localhost:3000
    description: Local server
paths:
  /users:
    get:
      summary: Get all users
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: string
                    name:
                      type: string
Bước 3: Tạo file để load Swagger Yaml 
Tạo một file mới swagger.ts (nằm trong src/utils hoặc src/config):
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import { Express } from 'express';

// Đọc file swagger.yml
const swaggerDocument = yaml.load(path.join(__dirname, '../config/swagger.yml'));

// Hàm khởi tạo Swagger
export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger docs available at /api-docs');
};
Bước 4: Tích hợp Swagger vào express 
Trong file app.ts hoặc file chính của server (thường nằm ở src/app.ts):
import express from 'express';
import { setupSwagger } from './utils/swagger'; // Đường dẫn tới file swagger.ts

const app = express();

// Các middleware khác
app.use(express.json());

// Khởi tạo Swagger
setupSwagger(app);

// Lắng nghe server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
Cấu trúc thư mục hợp lý:

Đặt file swagger.yml vào thư mục src/config.
Đặt file swagger.ts vào thư mục src/utils.
 -->
 <!-- 
 {
    "email": "mynnps37989@fpt.edu.vn",
  "password": "PhiTuyet123@"
  
  } test api => superadmin 
  -->
  
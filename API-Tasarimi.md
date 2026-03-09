# API Tasarımı - SkyUni Öğrenci Topluluk Platformu

**OpenAPI Spesifikasyon Dosyası:** [skyuni.yaml](skyuni.yaml)

Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış SkyUni API tasarımını içermektedir.

## OpenAPI Specification

```yaml

openapi: 3.0.3
info:
  title: SkyUni - Öğrenci Topluluk Platformu API
  description: |
    Bu API, üniversite öğrencilerinin dışarıya kapalı, güvenli bir şekilde
    iletişim kurması ve bilgi paylaşması için tasarlanmış bir RESTful servistir.
    
    ## Özellikler
    - Öğrenci kimlik doğrulama
    - Üniversite ve ders yönetimi
    - Sohbet kanalları ve mesajlaşma
  version: 1.0.0
  contact:
    name: API Destek Ekibi-MoonRose
    email: api-support@skyuni.com
    url: https://github.com/SkyUni-Project
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.skyuni.com/v1
    description: Production server
  - url: https://staging-api.skyuni.com/v1
    description: Staging server
  - url: http://localhost:3000/v1
    description: Development server
security:
  - BearerAuth: []

tags:
  - name: Kimlik Doğrulama
    description: Öğrencilerin sisteme kayıt, giriş ve çıkış işlemleri
  - name: Kullanıcılar
    description: Öğrenci profil bilgilerini yönetme işlemleri
  - name: Üniversite
    description: Üniversite, akademisyen ve ders kayıtlarının yönetimi
  - name: Mesaj
    description: Sohbet kanalları ve mesajlaşma işlemleri

paths:
  /auth/register:
    post:
      tags:
        - Kimlik Doğrulama
      summary: 1. Kayıt Olma
      description: Öğrencilerin sadece kendilerine ait üniversite e-posta adreslerini ve belirledikleri şifreyi kullanarak platforma yeni hesap oluşturmasını sağlar. Bu işlem sayesinde dışarıya kapalı, güvenli bir öğrenci topluluğu oluşturulur.
      operationId: register
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AuthInput'
      responses:
        "201":
          description: Kayıt başarılı. Hesap oluşturuldu.
        "400":
          description: Geçersiz istek verisi (Örn; e-posta formatı hatalı).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/login:
    post:
      tags:
        - Kimlik Doğrulama
      summary: 2. Giriş Yapma
      description: Sisteme daha önceden kayıt olmuş öğrencilerin, e-posta ve şifre bilgilerini doğrulayarak kendi hesaplarına güvenli bir şekilde erişim sağlamasını içerir.
      operationId: login
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AuthInput'
      responses:
        "200":
          description: Başarılı giriş. Token döndürüldü.
        "400":
          description: Geçersiz istek verisi.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "401":
          description: Kimlik doğrulama başarısız (Hatalı e-posta veya şifre).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/logout:
    post:
      tags:
        - Kimlik Doğrulama
      summary: 3. Çıkış Yapma
      description: Öğrencilerin platform üzerindeki aktif oturumlarını sonlandırarak sistemden güvenli bir şekilde ayrılmalarını sağlar. Özellikle ortak kullanılan cihazlarda hesap güvenliği için gereklidir.
      operationId: logout
      responses:
        "200":
          description: Başarıyla çıkış yapıldı. Oturum sonlandırıldı.
        "401":
          description: Kimlik doğrulama başarısız (Token eksik veya geçersiz).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /users/{userId}:
    parameters:
      - name: userId
        in: path
        required: true
        description: Öğrencinin benzersiz kimlik numarası
        schema:
          type: string
        example: "usr_98765"

    get:
      tags:
        - Kullanıcılar
      summary: 4. Profil Bilgilerini Görüntüleme
      description: Öğrencilerin platform üzerinde kendilerine ait olan ad, soyad, üniversite bilgisi ve kazandıkları başarımlar gibi detayları incelemesini sağlar.
      operationId: getUserProfile
      responses:
        "200":
          description: Profil bilgileri başarıyla getirildi.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'
        "401":
          description: Kimlik doğrulama başarısız.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "404":
          description: Kullanıcı bulunamadı.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    put:
      tags:
        - Kullanıcılar
      summary: 5. Profil Bilgilerini Güncelleme
      description: Öğrencilerin hesaplarına ait mevcut kişisel bilgilerinde (kısa özgeçmiş, avatar vb.) veya şifrelerinde değişiklik yapmasını sağlar.
      operationId: updateUserProfile
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserUpdateInput'
      responses:
        "200":
          description: Profil başarıyla güncellendi.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'
        "400":
          description: Geçersiz veri girişi.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "401":
          description: Kimlik doğrulama başarısız.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "403":
          description: Yetkisiz işlem (Sadece kendi profilini güncelleyebilir).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "404":
          description: Kullanıcı bulunamadı.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    delete:
      tags:
        - Kullanıcılar
      summary: 6. Hesabı Silme
      description: Öğrencilerin platformdaki üyeliklerini sonlandırması ve kendilerine ait tüm bilgileri sistemden kalıcı olarak kaldırmasını sağlar.
      operationId: deleteUserProfile
      responses:
        "204":
          description: Hesap başarıyla silindi (İçerik döndürülmez).
        "401":
          description: Kimlik doğrulama başarısız.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "403":
          description: Yetkisiz işlem (Sadece kendi hesabını silebilir).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "404":
          description: Kullanıcı bulunamadı.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /universities:
    get:
      tags:
        - Üniversite
      summary: 7. Üniversiteleri Listeleme
      description: Sisteme daha önceden eklenmiş olan tüm eğitim kurumlarının liste halinde görüntülenmesini sağlar. Kullanıcılar platformda hangi okulların olduğunu bu sayede inceler.
      operationId: listUniversities
      parameters:
        - name: page
          in: query
          required: false
          description: Sayfa numarası
          schema:
            type: integer
            default: 1
            minimum: 1
        - name: limit
          in: query
          required: false
          description: Sayfa başına kayıt sayısı
          schema:
            type: integer
            default: 10
            minimum: 1
            maximum: 100
      responses:
        "200":
          description: Üniversiteler başarıyla listelendi.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/University'
        "401":
          description: Kimlik doğrulama başarısız.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    post:
      tags:
        - Üniversite
      summary: 8. Üniversite Ekleme
      description: Platformda henüz bulunmayan yeni bir eğitim kurumunun sisteme dahil edilmesini sağlar. Kurumun adı ve internet adresi gibi temel bilgileri kaydedilir.
      operationId: addUniversity
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UniversityInput'
      responses:
        "201":
          description: Üniversite başarıyla eklendi.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/University'
        "400":
          description: Geçersiz istek verisi.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "401":
          description: Kimlik doğrulama başarısız.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /universities/{universityId}:
    delete:
      tags:
        - Üniversite
      summary: 9. Üniversite Silme
      description: Sistemde kayıtlı olan bir eğitim kurumunun, platformdan tamamen çıkarılmasını sağlar.
      operationId: deleteUniversity
      parameters:
        - name: universityId
          in: path
          required: true
          description: Silinecek üniversitenin benzersiz kimlik numarası
          schema:
            type: string
          example: "uni_101"
      responses:
        "204":
          description: Üniversite başarıyla silindi (İçerik döndürülmez).
        "401":
          description: Kimlik doğrulama başarısız.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "404":
          description: Silinmek istenen üniversite bulunamadı.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /universities/{universityId}/professors:
    parameters:
      - name: universityId
        in: path
        required: true
        description: İşlem yapılacak eğitim kurumunun kimlik numarası
        schema:
          type: string
        example: "uni_101"

    get:
      tags:
        - Üniversite
      summary: 17. Hocaları Listeleme
      description: Seçilen bir eğitim kurumunda görev yapan akademisyenlerin isimlerinin görüntülenmesini sağlar. Öğrenciler bu sayede hoca değerlendirmelerine ulaşabilir.
      operationId: listProfessors
      parameters:
        - name: page
          in: query
          required: false
          description: Sayfa numarası
          schema:
            type: integer
            default: 1
            minimum: 1
        - name: limit
          in: query
          required: false
          description: Sayfa başına kayıt sayısı
          schema:
            type: integer
            default: 10
            minimum: 1
            maximum: 100
      responses:
        "200":
          description: Hocalar başarıyla listelendi.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Professor'
        "401":
          description: Kimlik doğrulama başarısız.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "404":
          description: Üniversite bulunamadı.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    post:
      tags:
        - Üniversite
      summary: 18. Hoca Ekleme
      description: Sistemde henüz kaydı bulunmayan bir akademisyenin isim ve bölüm bilgilerinin platforma kaydedilmesini sağlar. Böylece o hoca hakkında konuşulabilmesinin önü açılır.
      operationId: addProfessor
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProfessorInput'
      responses:
        "201":
          description: Hoca başarıyla eklendi.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Professor'
        "400":
          description: Geçersiz istek verisi.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "401":
          description: Kimlik doğrulama başarısız.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /universities/{universityId}/courses:
    parameters:
      - name: universityId
        in: path
        required: true
        description: İşlem yapılacak eğitim kurumunun kimlik numarası
        schema:
          type: string
        example: "uni_101"

    get:
      tags:
        - Üniversite
      summary: 19. Dersleri Listeleme
      description: Seçilen bir eğitim kurumunda verilen derslerin isimlerinin liste halinde sunulmasını sağlar. Alt dönem öğrencileri bu sayede alınacak dersleri inceler.
      operationId: listCourses
      parameters:
        - name: page
          in: query
          required: false
          description: Sayfa numarası
          schema:
            type: integer
            default: 1
            minimum: 1
        - name: limit
          in: query
          required: false
          description: Sayfa başına kayıt sayısı
          schema:
            type: integer
            default: 10
            minimum: 1
            maximum: 100
      responses:
        "200":
          description: Dersler başarıyla listelendi.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Course'
        "401":
          description: Kimlik doğrulama başarısız.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "404":
          description: Üniversite bulunamadı.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    post:
      tags:
        - Üniversite
      summary: 20. Ders Ekleme
      description: Sistemde henüz kaydı bulunmayan yeni bir dersin adının ve kodunun platforma dahil edilmesini sağlar.
      operationId: addCourse
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CourseInput'
      responses:
        "201":
          description: Ders başarıyla eklendi.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Course'
        "400":
          description: Geçersiz istek verisi.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "401":
          description: Kimlik doğrulama başarısız.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /channels:
    get:
      tags:
        - Mesaj
      summary: 10. Kanalları Listeleme
      operationId: listChannels
      parameters:
        - name: page
          in: query
          required: false
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          required: false
          schema:
            type: integer
            default: 10
      responses:
        "200":
          description: Kanallar listelendi.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Channel'

    post:
      tags:
        - Mesaj
      summary: 11. Kanal Oluşturma
      operationId: createChannel
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChannelInput'
      responses:
        "201":
          description: Kanal oluşturuldu.

  /channels/{channelId}:
    delete:
      tags:
        - Mesaj
      summary: 12. Kanal Silme
      operationId: deleteChannel
      parameters:
        - name: channelId
          in: path
          required: true
          schema:
            type: string
      responses:
        "204":
          description: Kanal silindi.

  /channels/{channelId}/messages:
    get:
      tags:
        - Mesaj
      summary: 13. Mesajları Listeleme
      operationId: listMessages
      parameters:
        - name: channelId
          in: path
          required: true
          schema:
            type: string
        - name: page
          in: query
          required: false
          schema:
            type: integer
            default: 1
      responses:
        "200":
          description: Mesajlar listelendi.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Message'

    post:
      tags:
        - Mesaj
      summary: 14. Mesaj Gönderme
      operationId: sendMessage
      parameters:
        - name: channelId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MessageInput'
      responses:
        "201":
          description: Mesaj gönderildi.

  /messages/{messageId}:
    put:
      tags:
        - Mesaj
      summary: 15. Mesaj Düzenleme
      operationId: updateMessage
      parameters:
        - name: messageId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MessageInput'
      responses:
        "200":
          description: Mesaj güncellendi.

    delete:
      tags:
        - Mesaj
      summary: 16. Mesaj Silme
      operationId: deleteMessage
      parameters:
        - name: messageId
          in: path
          required: true
          schema:
            type: string
      responses:
        "204":
          description: Mesaj silindi.

components:
  securitySchemes:
    BearerAuth:
      type: apiKey
      in: header
      name: Authorization
      description: 'JWT tabanlı kimlik doğrulama. İstek başlığına "Authorization: Bearer <token>" eklenmeli.'

  schemas:
    AuthInput:
      type: object
      description: Kayıt olma veya giriş yapma işlemleri için gönderilecek kullanıcı verisi
      properties:
        email:
          type: string
          format: email
          example: "numaran@ogr.okulun.edu.tr"
        password:
          type: string
          format: password
          minLength: 8
          example: "Aygul123!"
      required:
        - email
        - password

    Error:
      type: object
      description: Standart hata yanıtı
      properties:
        message:
          type: string
          example: "İşlem gerçekleştirilemedi."
      required:
        - message
    UserProfile:
      type: object
      description: Öğrenci profil bilgilerini temsil eden model
      properties:
        id:
          type: string
          example: "usr_98765"
        adSoyad:
          type: string
          example: "Aygül"
        universite:
          type: string
          example: "Süleyman Demirel Üniversitesi"
        kisaOzgecmis:
          type: string
          example: "3. sınıf bilgisayar mühendisliği öğrencisi. Sosyal sorumluluk projelerine ilgi duyar."
        basarimlar:
          type: array
          items:
            type: string
          example: ["TEKNOFST Finalisti", "Topluluk Kurucusu","İyi bir gözlemci"]
      required:
        - id
        - adSoyad
        - universite

    UserUpdateInput:
      type: object
      description: Profil güncelleme isteği için gönderilecek veri
      properties:
        kisaOzgecmis:
          type: string
          example: "Web geliştirme teknolojileri ve 3B yazıcılar üzerine çalışıyorum."
        avatarUrl:
          type: string
          format: uri
          example: https://images.wallpapersden.com/image/download/rick-and-morty-into-the-space-hd_bWpuZW6UmZqaraWkpJRnamtlrWZlbWU.jpg
        password:
          type: string
          format: password
          minLength: 8
    University:
      type: object
      description: Üniversite bilgilerini temsil eden model
      properties:
        id:
          type: string
          example: "uni_101"
        name:
          type: string
          example: "Süleyman Demirel Üniversitesi"
        website:
          type: string
          format: uri
          example: "https://www.sdu.edu.tr"
      required:
        - id
        - name

    UniversityInput:
      type: object
      description: Üniversite ekleme isteği için gönderilecek veri
      properties:
        name:
          type: string
          minLength: 3
          example: "Süleyman Demirel Üniversitesi"
        website:
          type: string
          format: uri
          example: "https://www.sdu.edu.tr"
      required:
        - name
    Professor:
      type: object
      description: Akademisyen bilgilerini temsil eden model
      properties:
        id:
          type: string
          example: "prof_456"
        name:
          type: string
          example: "Asım Sinan Yüksel"
        department:
          type: string
          example: "Bilgisayar Mühendisliği"
      required:
        - id
        - name

    ProfessorInput:
      type: object
      description: Hoca ekleme isteği için gönderilecek veri
      properties:
        name:
          type: string
          minLength: 3
          example: "Asım Sinan Yüksel"
        department:
          type: string
          example: "Bilgisayar Mühendisliği"
      required:
        - name

    Course:
      type: object
      description: Ders bilgilerini temsil eden model
      properties:
        id:
          type: string
          example: "crs_789"
        code:
          type: string
          example: "BİL302"
        name:
          type: string
          example: "Yazılım Mühendisliği"
      required:
        - id
        - code
        - name

    CourseInput:
      type: object
      description: Ders ekleme isteği için gönderilecek veri
      properties:
        code:
          type: string
          example: "BİL302"
        name:
          type: string
          example: "Yazılım Mühendisliği"
      required:
        - code
        - name
    Channel:
      type: object
      properties:
        id:
          type: string
          example: "chn_001"
        name:
          type: string
          example: "Yazılım Mühendisliği Ders Notları"
        description:
          type: string
          example: "Ders notları."

    ChannelInput:
      type: object
      properties:
        name:
          type: string
          example: "Yazılım Mühendisliği Ders İçeriği"
        description:
          type: string
          example: "Yazılım mühendisliği dersiyle ilgili her türlü bilgi paylaşımı için."

    Message:
      type: object
      properties:
        id:
          type: string
          example: "msg_999"
        text:
          type: string
          example: "Ödevi bitiren var mı?"

    MessageInput:
      type: object
      properties:
        text:
          type: string
          example: "Ödevi bitiren var mı?,Notları payşaiabilir misiniz?"
``         
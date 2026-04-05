SkyUni - Gereksinimler

Kimlik Doğrulama İşlemleri:

1. POST: Kayıt Olma

Açıklama: Öğrencilerin kendi üniversite e-posta adreslerini ve belirledikleri şifreyi kullanarak platforma üye olmasıdır.

2. POST: Giriş Yapma

Açıklama: Sisteme daha önceden kayıt olmuş öğrencilerin, hesap bilgilerini doğrulayarak kendi profillerine erişim sağlamasıdır.

3. POST: Çıkış Yapma

Açıklama: Öğrencilerin platform üzerindeki aktif oturumlarını sonlandırarak sistemden güvenli bir şekilde ayrılmasıdır.

Kullanıcı İşlemleri:

4. GET: Profil Bilgilerini Görüntüleme

Açıklama: Öğrencilerin platform üzerinde kendilerine ait olan ad, soyad ve diğer kişisel detaylarını incelemesidir.

5. PUT: Profil Bilgilerini Güncelleme

Açıklama: Öğrencilerin hesaplarına ait mevcut kişisel bilgilerinde veya şifrelerinde değişiklik yapmasıdır.

6. DELETE: Hesabı Silme

Açıklama: Öğrencilerin platformdaki üyeliklerini sonlandırması ve kendilerine ait tüm bilgileri sistemden tamamen kaldırmasıdır.

Üniversite İşlemleri:

7. GET: Üniversiteleri Listeleme

Açıklama: Sisteme daha önceden eklenmiş olan tüm eğitim kurumlarının liste halinde görüntülenmesidir.

8. POST: Üniversite Ekleme

Açıklama: Platformda henüz bulunmayan yeni bir eğitim kurumunun sisteme dahil edilmesidir.

9. DELETE: Üniversite Silme

Açıklama: Sistemde kayıtlı olan bir eğitim kurumunun, platformdan tamamen çıkarılmasıdır.

Kanal İşlemleri:

10. GET: Kanalları Listeleme

Açıklama: Platform içerisinde belirli konularda tartışmak için açılmış olan tüm sohbet odalarının görüntülenmesidir.

11. POST: Kanal Oluşturma

Açıklama: Öğrencilerin yeni bir konu veya ders hakkında fikir alışverişi yapmak için özel bir sohbet odası açmasıdır.

12. DELETE: Kanal Silme

Açıklama: Önceden oluşturulmuş bir sohbet odasının platformdan kalıcı olarak kaldırılmasıdır.

Mesaj İşlemleri:

13. GET: Mesajları Listeleme

Açıklama: Seçilen bir sohbet odasında daha önce diğer öğrenciler tarafından yazılmış olan yazıların ekranda okunmasıdır.

14. POST: Mesaj Gönderme

Açıklama: Öğrencilerin bir sohbet odasına kendi fikirlerini, sorularını veya ders notlarını yazı olarak eklemesidir.

15. PUT: Mesaj Düzenleme

Açıklama: Öğrencilerin daha önceden yazmış oldukları kendi yazılarını sonradan değiştirerek düzeltmesidir.

16. DELETE: Mesaj Silme

Açıklama: Öğrencilerin daha önce göndermiş oldukları kendi yazılarını sohbet odasından tamamen silmesidir.

Hoca & Ders İşlemleri:

17. GET: Hocaları Listeleme

Açıklama: Seçilen bir eğitim kurumunda görev yapan tüm akademisyenlerin isimlerinin görüntülenmesidir.

18. POST: Hoca Ekleme

Açıklama: Sistemde henüz kaydı bulunmayan bir akademisyenin isim bilgilerinin platforma kaydedilmesidir.

19. GET: Dersleri Listeleme

Açıklama: Seçilen bir eğitim kurumunda verilen tüm derslerin isimlerinin liste halinde sunulmasıdır.

20. POST: Ders Ekleme

Açıklama: Sistemde henüz kaydı bulunmayan yeni bir dersin platforma dahil edilmesidir.
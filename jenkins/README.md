# SkyUni - Lokal Jenkins CI/CD

Bu klasor SkyUni projesi icin lokal Jenkins kurulumunu icerir. Amac: her degisiklikte
**checkout -> install -> lint/syntax -> build** asamalarini Jenkins'te calistirip
`localhost:8080`'de asama grafiginin (Stage View) yesile donusunu izlemek.

## Ne nerede?
- `../Dockerfile.jenkins` : `jenkins/jenkins:lts-jdk17` uzerine Node 20 + git + eklentiler.
- `../Jenkinsfile` : pipeline tanimi (asamalar).
- `skyuni-pipeline-config.xml` : pipeline job tanimi (lokal repodan SCM checkout).

## Container nasil kuruldu (ZATEN YAPILDI)
```bash
# 1) Imaj (kucuk bir bos klasorden, repoyu context'e gondermeden):
docker build -t skyuni-jenkins:latest -f Dockerfile.jenkins <bos-klasor>

# 2) Container (kalici volume + repo salt-okunur bagli):
docker run -d --name skyuni-jenkins --restart unless-stopped \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v "C:\Users\OMEN\Desktop\SkyUni:/var/skyuni-repo:ro" \
  skyuni-jenkins:latest
```

## Senin yapacaklarin (tarayicida)

### 1. Kurulum sihirbazi
1. `http://localhost:8080` ac.
2. **Administrator password** istenir. Almak icin:
   ```bash
   docker exec skyuni-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
3. **Install suggested plugins** sec (onerilen eklentiler).
4. Admin kullanici olustur (kullanici adi + sifre + e-posta) -> Save and Continue.
5. Jenkins URL ekrani -> Save and Finish -> Start using Jenkins.

### 2. Pipeline'i calistir
- Ana sayfada **skyuni-pipeline** job'i hazir gelir (otomatik kuruldu).
- Job'a tikla -> sol menude **Build Now**.

### 3. Asamalari (Stages) izle
- Job sayfasinda **Stage View** tablosu cikar.
- Her asama (Checkout, Backend Install, Frontend Install, Lint & Syntax, Build)
  sirayla **mavi/gri -> yesil** olur. Kirmizi olan asamanin kutusuna tiklayip
  **Logs**'tan sebebini gorebilirsin.
- Build numarasina (#1) -> **Console Output** ile tam logu gorursun.

## Notlar
- **Lint:** Mevcut frontend kodunda ~81 eski ESLint hatasi var. Build kirilmasin diye
  Jenkinsfile'da lint RAPOR amacli calisiyor (`npm run lint || true`). Lint'i temizleyince
  Jenkinsfile'daki `|| true`'yu silip gercek gate yapabilirsin.
- **Backend syntax** kontrolu (`node --check`) gercek gate: bozuk JS varsa build kirilir.
- **Test yok**, o yuzden test asamasi eklenmedi.
- **Docker Compose build** asamasi yok cunku projede Dockerfile/compose yok (opsiyonel birakildi).
- Job, repoyu `file:///var/skyuni-repo` uzerinden ve **commit'li** `feature/jenkins`
  dalindan klonlar. Jenkinsfile'i degistirirsen **commit etmen** gerekir (push sart degil).

## Faydali komutlar
```bash
docker logs -f skyuni-jenkins          # canli log
docker restart skyuni-jenkins          # yeniden baslat (ayarlar volume'de korunur)
docker stop skyuni-jenkins             # durdur
docker start skyuni-jenkins            # baslat
```

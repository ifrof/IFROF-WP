# خطة إعادة التأهيل الأمني والتشغيلي لمنصة IFROF.com (B2B High-Risk)

> هذا المستند يضع خطة إصلاح فورية (Fix Plan) مرتبة بالأولوية، وتصميمًا تقنيًا لنظامي المصادقة والصلاحيات، وإعادة بناء نموذج الثقة للموردين (Verified Suppliers)، ومعالجة الامتثال القانوني، واقتراحات التقوية (Hardening). الهدف النهائي: تحويل المنصة من حالة عالية المخاطر إلى منصة B2B موثوقة قابلة للتوسع والإطلاق التجاري.

---

## 1) Fix Plan فورية مرتبة بالأولوية (Go/No-Go)

> **المبدأ:** معالجة الأخطاء القاتلة أولًا قبل أي إطلاق تجاري.

### A) حرِجة جدًا (Go/No-Go)

1. **قفل الوصول والتحكم بالهوية**
   - تفعيل MFA للحسابات الحساسة (إدارة/مدراء/مشرفين).
   - تطبيق Rate Limiting وAccount Lockout/Backoff على محاولات تسجيل الدخول.
   - فرض صلاحيات Role-Based على السيرفر فقط (Server-Side Enforcement).
2. **إغلاق ثغرات IDOR وPrivilege Escalation**
   - مراجعة كاملة لكل نقاط API التي تقبل `id` أو `supplierId` أو `orderId`.
   - تطبيق Authorization Policy موحدة (Policy Engine) لكل العمليات الحساسة.
3. **إيقاف نشر Verified Suppliers بدون تحقق واقعي**
   - تعطيل التحقق الحالي/الرمزي.
   - إظهار شارة "Pending Verification" مؤقتًا بدلاً من "Verified".
4. **إزالة 404s وسوق فارغ**
   - إزالة/إخفاء المسارات الميتة في الواجهة.
   - تفعيل صفحات فارغة واضحة مع CTA (لا تُربك المستخدم).
5. **وجود وثائق قانونية وامتثال أساسي**
   - Privacy Policy + Terms جاهزة للنشر مع نقاط GDPR/CCPA.
   - Consent Management واضح (إشعارات الكوكيز والموافقة على المعالجة).

### B) أولوية عالية (قبل الإطلاق العام)

1. **نموذج Trust B2B الكامل للـ Verified Factory**
   - توثيق متعدد المراحل (وثائق، تدقيق، طرف ثالث).
   - منع انتحال الموردين (التحقق من ملكية الدومين، سجلات تجارية).
2. **مراقبة وتسجيل مركزي للأحداث الأمنية**
   - تتبع تسجيلات الدخول، تغييرات الصلاحيات، تعديلات بيانات الموردين.
   - تنبيهات آنية عند سلوك غير طبيعي.
3. **ضوابط الامتثال**
   - تصنيف البيانات وتحديد فترات الاحتفاظ.
   - مسارات للطلبات القانونية (Access/Delete/Export).

### C) تحسينات ضرورية بعد الإطلاق الأولي

1. **تحسين تجربة المراجعة والتحقق**
   - لوحات متابعة لحالة التحقق.
   - أتمتة جزئية للفحوصات.
2. **نضج أمني تشغيلي**
   - تدريب الفريق + Runbooks للحوادث.
   - اختبارات دورية (Security Review + Pen Test داخلي).

---

## 2) تصميم نظام Authentication قوي

### المتطلبات الأساسية

- **MFA إلزامي** للحسابات الإدارية والموردين الموثقين.
- **Rate Limiting** على تسجيل الدخول، التسجيل، وReset Password.
- **Password Policy**: طول ≥ 12، منع كلمات مرور شائعة، دعم فحص التسريبات (HIBP-like).
- **Session Management**: Tokens قصيرة العمر + Refresh Tokens آمنة.

### مكونات التصميم

1. **Login Flow**
   - فحص البريد/الهاتف.
   - كلمة مرور قوية.
   - MFA (TOTP أو WebAuthn للمدراء).
2. **الحد من الهجمات**
   - Rate limiting ديناميكي حسب IP + حساب + جهاز.
   - Backoff تصاعدي عند محاولات فاشلة.
   - حظر مؤقت عند نشاط غير اعتيادي.
3. **الحماية من Credential Stuffing**
   - Device Fingerprinting بسيط.
   - Captcha عند الاشتباه فقط (Risk-Based).
4. **Audit Logs**
   - سجل لكل محاولة دخول ناجحة أو فاشلة مع IP وUser-Agent.

---

## 3) نموذج Authorization صارم لمنع IDOR وPrivilege Escalation

### مبادئ

- **Zero Trust**: لا ثقة في أي مدخلات من العميل.
- **Server-Side Enforcement**: لا اعتماد على UI.
- **Least Privilege** لكل دور.

### تصميم النموذج

1. **RBAC + ABAC**
   - أدوار ثابتة (Admin / Supplier / Buyer / Auditor).
   - خصائص سياقية (Account Status, Verification Stage, Ownership).
2. **Policy Engine موحد**
   - وظيفة/طبقة `authorize(action, resource, actor)` لكل Endpoint.
   - رفض ضمني لأي حالة غير مصرح بها.
3. **حماية من IDOR**
   - استبدال IDs العامة بـ UUIDs أو Public IDs.
   - تحقق ملكية المورد لكل مورد/منتج/طلب.
4. **مصفوفة صلاحيات (Permission Matrix)**
   - توثيق رسمي لكل دور مقابل كل عملية.
   - استخدام Allowlist وليس Denylist.

---

## 4) إعادة بناء نموذج الثقة B2B (Verified Factory)

### مراحل التحقق المقترحة

1. **المرحلة 0: Registration**
   - بريد رسمي + رقم هاتف + توثيق أساسي.
2. **المرحلة 1: Document Verification**
   - سجل تجاري + سجل ضريبي + هوية المالك.
   - تحقق من الدومين (DNS/Email control).
3. **المرحلة 2: Audit / Validation**
   - تدقيق داخلي أو عبر طرف ثالث.
   - مراجعة منشأة ميدانية/افتراضية.
4. **المرحلة 3: Ongoing Monitoring**
   - إعادة تحقق دوري (مثلاً كل 12 شهر).
   - نظام شكاوى ومراجعات موثقة.

### منع Fake Suppliers بشكل منهجي

- منع إضافة منتجات قبل مرحلة التحقق الأساسية.
- تحقق من الحساب البنكي وربطه بالكيان القانوني.
- ربط الحساب بشركة رسمية وليس فرد.
- تسجيل كل التعديلات الحساسة مع تواريخ وشخص مسؤول.

---

## 5) الامتثال القانوني (GDPR / CCPA Ready)

### وثائق إلزامية

1. **Privacy Policy**
   - أنواع البيانات، الهدف، مدة التخزين، أطراف ثالثة.
   - حقوق المستخدم (Access, Delete, Export).
2. **Terms & Conditions**
   - مسؤوليات المنصة، حدود المسؤولية، سياسة فض النزاعات.
3. **Consent Management**
   - موافقة صريحة للكوكيز غير الضرورية.
   - توثيق سجل الموافقات.

### Data Handling

- تصنيف البيانات (PII, Financial, Commercial).
- سياسة احتفاظ واضحة + حذف تلقائي.
- تشفير البيانات الحساسة at-rest و in-transit.

---

## 6) Hardening للبنية (Security Headers + Infra)

### Security Headers

- `Content-Security-Policy` (CSP) صارمة.
- `Strict-Transport-Security` (HSTS).
- `X-Frame-Options` (deny).
- `X-Content-Type-Options` (nosniff).
- `Referrer-Policy`.

### Infra Protections

- **WAF / CDN** لحماية ضد DDoS وBot Traffic.
- **Monitoring & Alerting** (SIEM أو Log Aggregation).
- **Backup & Disaster Recovery** مع اختبارات دورية.

---

## 7) Checklist تنفيذية

### أ) Go/No-Go Checklist (قبل أي إطلاق)

- [ ] MFA مفعّل للحسابات الحساسة.
- [ ] Rate limiting مطبق على جميع نقاط الدخول الحساسة.
- [ ] Authorization موحد server-side.
- [ ] إزالة Verified بدون تحقق حقيقي.
- [ ] إغلاق كل IDOR.
- [ ] Privacy Policy + Terms منشورة.
- [ ] صفحات 404/سوق فارغ مع معالجة UX واضحة.

### ب) Readiness Checklist (جاهزية الإطلاق التجاري)

- [ ] Verified Supplier Pipeline مكتمل.
- [ ] Audit Logs + Monitoring فعّالة.
- [ ] سياسة احتفاظ بيانات وتوثيق حقوق المستخدم.
- [ ] Security Headers مفعّلة.
- [ ] WAF/CDN مطبّق.
- [ ] خطة استجابة للحوادث جاهزة.

---

## 8) قرار جاهزية نهائي

**الحالة الحالية:** Not Ready

**الشرط للانتقال إلى Ready:**

- إنجاز جميع عناصر Go/No-Go بدون استثناء.
- إنجاز 70% على الأقل من Readiness Checklist.
- توقيع قانوني على سياسات الخصوصية والشروط.

> بعد اكتمال هذه الشروط، يتم اعتماد المنصة كـ **Ready** للإطلاق التجاري المحدود (Soft Launch) قبل التوسع الكامل.

---

## 9) مخرجات قابلة للتنفيذ فورًا (خطوات عملية أول 14 يوم)

**الأسبوع 1:**

1. تنفيذ MFA + Rate Limiting.
2. Policy Engine لكل API endpoint.
3. نشر Privacy Policy + Terms.
4. تعطيل علامة Verified الحالية.

**الأسبوع 2:**

1. بناء Verified Supplier Pipeline.
2. إضافة Audit Logs وMonitoring.
3. تفعيل Security Headers.
4. تجهيز WAF/CDN.

---

> **ملاحظة:** هذه الخطة تركز على الحلول القابلة للتنفيذ فورًا بدون تشغيل أوامر هجومية أو استغلالات. الهدف إعادة بناء الثقة والجاهزية الأمنية، مع وضوح قانوني وتشغيلي.

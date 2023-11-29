# Turborepo Başlangıç Örneği

Bu, resmi bir Turborepo başlangıç örneğidir.

## Bu örneği kullanma

Aşağıdaki komutu çalıştırın:

npx create-turbo@latest

## İçinde ne var?

Bu Turborepo aşağıdaki paketleri/uygulamaları içerir:

### Uygulamalar ve Paketler

- `docs`: Bir Next.js uygulaması
- `web`: Başka bir Next.js uygulaması
- `ui`: Hem `web` hem de `docs` uygulamaları tarafından paylaşılan bir React bileşen kütüphanesi
- `eslint-config-custom`: `eslint` yapılandırmaları (`eslint-config-next` ve `eslint-config-prettier` içerir)
- `tsconfig`: Monorepo boyunca kullanılan `tsconfig.json`'lar

Her paket / uygulama %100 TypeScript'tir.

### Yardımcı Programlar

Bu Turborepo sizin için önceden kurulmuş bazı ek araçlara sahiptir:

- Statik tip denetimi için TypeScript
- Kod linting için ESLint
- Kod formatlama için Prettier

### Derleme

Tüm uygulamaları ve paketleri derlemek için aşağıdaki komutu çalıştırın:

cd my-turborepo
pnpm build
Use code with caution. Learn more
Geliştirme
Tüm uygulamaları ve paketleri geliştirmek için aşağıdaki komutu çalıştırın:

cd my-turborepo
pnpm dev

### Uzak Önbellek

Turborepo, önbellek yapıtılarını makineler arasında paylaşmak için Uzak Önbellek olarak bilinen bir teknik kullanabilir. Bu, build önbelleklerini ekibiniz ve CI/CD pipelines'larıyla paylaşmanıza olanak tanır.

Varsayılan olarak, Turborepo yerel olarak önbelleklenir. Uzak Önbelleği etkinleştirmek için bir Vercel hesabına sahip olmanız gerekir. Hesabınız yoksa bir tane oluşturabilirsiniz: [https://vercel.com/signup](https://vercel.com/signup), ardından aşağıdaki komutları girin:

cd my-turborepo
npx turbo login

Bu, Turborepo CLI'nı Vercel hesabınız ile kimlik doğrulamasını sağlayacaktır.

Ardından, Turborepo'nuzu Uzak Önbelleğe aşağıdaki komutu Turborepo'nuzun kökünden çalıştırarak bağlayabilirsiniz:

npx turbo link

## Faydalı Linkler

Turborepo'nun gücünü daha iyi öğrenin:

- Görevler: [https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- Önbellek: [https://turbo.build/repo/docs/core-concepts/caching](https://turbo.build/repo/docs/core-concepts/caching)
- Uzak Önbellek: [https://turbo.build/repo/docs/core-concepts/remote-caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- Filtreleme: [https://turbo.build/repo/docs/core-concepts/monorepos/filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- Yapılandırma Seçenekleri: [https://turbo.build/repo/docs/reference/configuration](https://turbo.build/repo/docs/reference/configuration)
- CLI Kullanımı: [https://turbo.build/repo/docs/reference/command-line-reference](https://turbo.build/repo/docs/reference/command-line-reference)

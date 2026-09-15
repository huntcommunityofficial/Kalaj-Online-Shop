const SECTIONS = [
  { title: 'پذیرش قوانین', text: 'با استفاده از سایت کالاژ، شما با تمامی قوانین و مقررات ذکرشده در این صفحه موافقت می‌کنید.' },
  { title: 'حساب کاربری', text: 'کاربران موظف‌اند اطلاعات صحیح و به‌روز هنگام ثبت‌نام ارائه دهند. مسئولیت حفظ محرمانگی رمز عبور بر عهده کاربر است.' },
  { title: 'خرید و پرداخت', text: 'تمامی قیمت‌ها به تومان و شامل مالیات بر ارزش افزوده است. پرداخت از طریق درگاه‌های امن بانکی انجام می‌شود.' },
  { title: 'ارسال و تحویل کالا', text: 'زمان ارسال بسته به موجودی و منطقه جغرافیایی متفاوت است. کالاژ متعهد به ارسال در سریع‌ترین زمان ممکن است.' },
  { title: 'بازگشت و مرجوعی کالا', text: 'مشتریان می‌توانند تا ۷ روز پس از دریافت کالا، در صورت عدم استفاده و سالم بودن بسته‌بندی، درخواست مرجوعی دهند.' },
  { title: 'فروشندگان', text: 'فروشندگان مسئول صحت اطلاعات محصولات خود هستند و کالاژ حق تعلیق فروشندگانی که قوانین را نقض کنند دارد.' },
  { title: 'حریم خصوصی', text: 'اطلاعات شخصی کاربران محرمانه نگهداری شده و صرفاً برای بهبود خدمات و پردازش سفارش استفاده می‌شود.' },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-2">قوانین و مقررات</h1>
      <p className="text-gray-500 text-sm mb-8">آخرین بروزرسانی: مرداد ۱۴۰۵</p>
      <div className="flex flex-col gap-6">
        {SECTIONS.map((s, i) => (
          <div key={s.title} className="bg-white border border-[var(--color-line)] rounded-2xl p-5">
            <h2 className="font-bold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand-deep)] text-xs flex items-center justify-center">{i + 1}</span>
              {s.title}
            </h2>
            <p className="text-sm text-gray-600 leading-7">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

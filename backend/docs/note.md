# **1. Các annotation validation hay dùng**

| Annotation               | Ý nghĩa                                                   |
| ------------------------ | ----------------------------------------------------------- |
| @NotNull                 | Không được null                                         |
| @NotEmpty                | Không null và không rỗng                                |
| @NotBlank                | Không null, không rỗng, không chỉ chứa khoảng trắng |
| @Size(min, max)          | Kiểm tra độ dài                                         |
| @Email                   | Kiểm tra email                                             |
| @Min(value)              | Giá trị nhỏ nhất                                        |
| @Max(value)              | Giá trị lớn nhất                                        |
| @Positive                | Số dương                                                 |
| @Negative                | Số âm                                                     |
| @Pattern(regexp = "...") | Kiểm tra theo regex                                        |

# 2. @Valid và @Validated khác nhau thế nào?

| Annotation     | Dùng khi nào                                     |
| -------------- | -------------------------------------------------- |
| `@Valid`     | Validate DTO/request object thông thường        |
| `@Validated` | Validate method parameters hoặc validation groups |

# 3. Phân biệt `@NotNull`, `@NotEmpty`, `@NotBlank`

Ba annotation này đều dùng để kiểm tra dữ liệu  **không hợp lệ khi bị thiếu** , nhưng mức độ kiểm tra khác nhau.

---

## 1. `@NotNull`

Chỉ kiểm tra giá trị  **khác `null`** .

<pre class="overflow-visible! px-0!" data-start="225" data-end="299"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>@</span><span class="ͼ11">NotNull</span><span>(</span><span class="ͼ11">message</span><span></span><span class="ͼv">=</span><span></span><span class="ͼz">"Tên không được null"</span><span>)</span><br/><span class="ͼv">private</span><span></span><span class="ͼ11">String</span><span></span><span class="ͼ11">name</span><span>;</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

| Giá trị | Hợp lệ? |
| --------- | --------- |
| `null`  | ❌        |
| `""`    | ✅        |
| `"   "` | ✅        |
| `"Nam"` | ✅        |

### Dùng cho

* `Integer`
* `Long`
* `Boolean`
* `LocalDate`
* Object bất kỳ

Ví dụ:

<pre class="overflow-visible! px-0!" data-start="479" data-end="558"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>@</span><span class="ͼ11">NotNull</span><span>(</span><span class="ͼ11">message</span><span></span><span class="ͼv">=</span><span></span><span class="ͼz">"Tuổi không được bỏ trống"</span><span>)</span><br/><span class="ͼv">private</span><span></span><span class="ͼ11">Integer</span><span></span><span class="ͼ11">age</span><span>;</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

---

## 2. `@NotEmpty`

Kiểm tra:

* Không được `null`
* Không được rỗng

Dùng được cho:

* `String`
* `Collection`
* `Map`
* Array

<pre class="overflow-visible! px-0!" data-start="693" data-end="768"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>@</span><span class="ͼ11">NotEmpty</span><span>(</span><span class="ͼ11">message</span><span></span><span class="ͼv">=</span><span></span><span class="ͼz">"Tên không được rỗng"</span><span>)</span><br/><span class="ͼv">private</span><span></span><span class="ͼ11">String</span><span></span><span class="ͼ11">name</span><span>;</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

| Giá trị | Hợp lệ? |
| --------- | --------- |
| `null`  | ❌        |
| `""`    | ❌        |
| `"   "` | ✅        |
| `"Nam"` | ✅        |

### Ví dụ với List

<pre class="overflow-visible! px-0!" data-start="883" data-end="983"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>@</span><span class="ͼ11">NotEmpty</span><span>(</span><span class="ͼ11">message</span><span></span><span class="ͼv">=</span><span></span><span class="ͼz">"Danh sách sản phẩm không được rỗng"</span><span>)</span><br/><span class="ͼv">private</span><span></span><span class="ͼ11">List</span><span><</span><span class="ͼ11">Long</span><span>> </span><span class="ͼ11">productIds</span><span>;</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

| Giá trị  | Hợp lệ? |
| ---------- | --------- |
| `null`   | ❌        |
| `[]`     | ❌        |
| `[1, 2]` | ✅        |

---

## 3. `@NotBlank`

Kiểm tra:

* Không được `null`
* Không được rỗng `""`
* Không được chỉ chứa khoảng trắng `"   "`

Chỉ dùng cho  **String** .

<pre class="overflow-visible! px-0!" data-start="1211" data-end="1290"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>@</span><span class="ͼ11">NotBlank</span><span>(</span><span class="ͼ11">message</span><span></span><span class="ͼv">=</span><span></span><span class="ͼz">"Tên không được để trống"</span><span>)</span><br/><span class="ͼv">private</span><span></span><span class="ͼ11">String</span><span></span><span class="ͼ11">name</span><span>;</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

| Giá trị | Hợp lệ? |
| --------- | --------- |
| `null`  | ❌        |
| `""`    | ❌        |
| `"   "` | ❌        |
| `"Nam"` | ✅        |

---

## Bảng so sánh tổng quát

| Annotation    | `null` | `""` | `"   "` | Dùng cho                |
| ------------- | -------- | ------ | --------- | ------------------------ |
| `@NotNull`  | ❌       | ✅     | ✅        | Mọi object              |
| `@NotEmpty` | ❌       | ❌     | ✅        | String, List, Map, Array |
| `@NotBlank` | ❌       | ❌     | ❌        | Chỉ String              |




# 4. Custom Validator

```
@Constraint(
   validatedBy = {}
)
@Target()
@Retention()
@Repeatable()
public @interface Example{
   String message() default "{jakarta.validation.constraints.NotBlank.message}";
   Class<?>[] groups() default {};

   Class<? extends Payload>[] payload() default {};
}

```


* `@Constraint(...)`: đánh dấu đây là annotation validation
* `validatedBy = VoucherCodeValidator.class`: class thực hiện logic kiểm tra
* `message`: thông báo lỗi mặc định
* `groups`, `payload`: phần bắt buộc theo chuẩn Bean Validation
* `@Target` quy định  **annotation này được phép đặt ở đâu** , ex:

    a. Field

<pre class="overflow-visible! px-0!" data-start="256" data-end="339"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span class="ͼv">public</span><span></span><span class="ͼv">class</span><span></span><span class="ͼ11">UserRequest</span><span> {</span><br/><br/><span>    @</span><span class="ͼ11">ValidPhone</span><br/><span></span><span class="ͼv">private</span><span></span><span class="ͼ11">String</span><span></span><span class="ͼ11">phone</span><span>;</span><br/><span>}</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

Ở đây `@ValidPhone` gắn vào biến `phone`.


    b. Parameter

<pre class="overflow-visible! px-0!" data-start="407" data-end="469"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="relative"><div class=""><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span class="ͼv">public</span><span></span><span class="ͼv">void</span><span></span><span class="ͼ11">findUser</span><span>(@</span><span class="ͼ11">ValidPhone</span><span></span><span class="ͼ11">String</span><span></span><span class="ͼ11">phone</span><span>) {</span><br/><span>}</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

Ở đây `@ValidPhone` gắn vào tham số method.

Một số element type phổ biến

| ElementType         | Dùng cho                |
| ------------------- | ------------------------ |
| `FIELD`           | Thuộc tính trong class |
| `PARAMETER`       | Tham số của method     |
| `METHOD`          | Method                   |
| `TYPE`            | Class, interface         |
| `CONSTRUCTOR`     | Constructor              |
| `ANNOTATION_TYPE` | Annotation khác         |



`@Retention(RetentionPolicy.RUNTIME)`

`@Retention` quy định annotation được giữ lại  **đến giai đoạn nào** .

| RetentionPolicy | Ý nghĩa                                                           |
| --------------- | ------------------------------------------------------------------- |
| `SOURCE`      | Chỉ tồn tại trong source code, mất khi compile                  |
| `CLASS`       | Có trong file `.class`, nhưng không đọc được lúc runtime |
| `RUNTIME`     | Tồn tại khi chạy chương trình, Reflection đọc được       |

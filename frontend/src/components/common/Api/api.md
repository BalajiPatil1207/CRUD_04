# api.js — Helper Documentation

File location: `src/components/common/Api/api.js`

---

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `Api` | Axios Instance | API calls साठी वापरा (GET, POST, PUT, DELETE) |
| `IMAGE_BASE_URL` | String | Backend वरील images display करण्यासाठी |
| `sessionStore` | Function | Login नंतर token + user save करण्यासाठी |
| `sessionRemove` | Function | Logout नंतर session clear करण्यासाठी |

---

## Import करायचे कसे?

```js
import { Api, IMAGE_BASE_URL, sessionStore, sessionRemove } from "../common/Api/api";
```

---

## 1. `Api` — HTTP Calls

`axios` instance आहे. सगळ्या API calls याच्याद्वारे करायच्या.

**Base URL:** `http://localhost:4000/api`

```js
// GET
const res = await Api.get("/patients");

// POST
const res = await Api.post("/patients", { name: "Rohit", age: 25 });

// PUT
const res = await Api.put("/patients/1", { name: "Rohit Patil" });

// DELETE
const res = await Api.delete("/patients/1");
```

> **Note:** Token असेल तर `Authorization: Bearer <token>` header आपोआप लागतो — manually लिहायची गरज नाही.

---

## 2. `IMAGE_BASE_URL` — Images Display करणे

**Value:** `http://localhost:4000/uploads/`

Backend च्या `uploads/` folder मधील images दाखवण्यासाठी वापरा.

```jsx
import { IMAGE_BASE_URL } from "../common/Api/api";

// Basic usage
<img src={IMAGE_BASE_URL + record.photo} alt="Photo" />

// Error fallback सह (image नसेल तर default दाखवेल)
<img
  src={IMAGE_BASE_URL + record.photo}
  alt="Photo"
  onError={(e) => e.target.src = "/default-avatar.png"}
/>
```

**Output example:**
```
http://localhost:4000/uploads/patient_photo.jpg
```

---

## 3. `sessionStore(token, user)` — Session Save

Login यशस्वी झाल्यावर वापरा.

```js
import { sessionStore } from "../common/Api/api";

// Login response नंतर
const res = await Api.post("/auth/login", { email, password });
sessionStore(res.data.token, res.data.user);
```

**काय store होते?**
- `sessionStorage["token"]` → JWT token
- `sessionStorage["users"]` → User object (JSON)

---

## 4. `sessionRemove()` — Session Clear

Logout करताना वापरा.

```js
import { sessionRemove } from "../common/Api/api";

const handleLogout = () => {
    sessionRemove();
    navigate("/");
};
```

---

## File Upload — Automatic FormData Conversion

Data मध्ये `File` object असेल तर `Api` आपोआप `FormData` convert करतो. तुम्हाला manually `FormData` बनवायची गरज नाही.

```js
// हे directly काम करेल
await Api.post("/patients", {
    name: "Rohit",
    age: 25,
    photo: fileInputRef.current.files[0]  // File object
});
```

---

## Error Handling — Auto Logout

| Status | काय होते? |
|--------|----------|
| `401 Unauthorized` | Session clear होते + Login page वर redirect |

```js
// try-catch मध्ये handle करा
try {
    const res = await Api.get("/patients");
    setData(res.data);
} catch (error) {
    console.error(error.response?.data?.message || "काहीतरी चुकले!");
}
```

---

## Internal Constants (exported नाहीत)

| Constant | Value |
|----------|-------|
| `BASE_URL` | `http://localhost:4000` |

> Production deploy करताना फक्त `BASE_URL` आणि `IMAGE_BASE_URL` मधील URL बदलायची.

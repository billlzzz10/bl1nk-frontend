# Obsidian AI MCP Plugin v0.3.0

## 🧠 ภาพรวม

ปลั๊กอิน AI MCP (Model Context Protocol) สำหรับ Obsidian ที่มีความสามารถขั้นสูงในการจัดการความรู้ด้วย AI พร้อมฟีเจอร์ครบครัน:

- **Memory Graph**: ระบบกราฟความทรงจำที่เชื่อมโยงข้อมูลอย่างชาญฉลาด
- **RAG (Retrieval-Augmented Generation)**: ค้นหาและดึงข้อมูลจาก vault ด้วย Mistral embeddings
- **Chat Interface**: หน้าต่างแชทแบบ responsive พร้อมโหมด 3 แบบ
- **Role-based AI**: ระบบ AI ที่ปรับเปลี่ยนบทบาทได้ตามความต้องการ
- **Performance Optimization**: การปรับปรุงประสิทธิภาพแบบอัตโนมัติ
- **Smart Features**: ฟีเจอร์ขั้นสูงอย่าง auto-tagging และ smart suggestions

## 🚀 การติดตั้ง

### ขั้นตอนที่ 1: คัดลอกไฟล์
```bash
# คัดลอกโฟลเดอร์ทั้งหมดไปยัง
.obsidian/plugins/obsidian-ai-mcp-plugin/
```

### ขั้นตอนที่ 2: ติดตั้ง Dependencies
```bash
cd .obsidian/plugins/obsidian-ai-mcp-plugin/
npm install
```

### ขั้นตอนที่ 3: เปิดใช้งานใน Obsidian
1. เปิด Settings > Community Plugins
2. เปิดใช้งาน "AI MCP Plugin"
3. หรือใช้ Plugin Development Tool สำหรับ hot-reload

### ขั้นตอนที่ 4: ตั้งค่า API Keys
1. เปิด Settings > AI MCP Plugin
2. ใส่ **Mistral API Key** (ฟรี tier มีให้)
3. ตั้งค่า **Qdrant URL** (local: `http://localhost:6333`)
4. ตั้งค่าเพิ่มเติมตามต้องการ

### ขั้นตอนที่ 5: เริ่มต้นใช้งาน
1. รันคำสั่ง "Initialize Vault Memory (Full Scan)"
2. ทดสอบด้วย "Test Vault Recall"
3. เปิด AI Chat ด้วยไอคอน 🧠 ใน ribbon

## 🎯 ฟีเจอร์หลัก

### 💬 Chat Interface
- **3 โหมดการทำงาน**: Ask, Planning, Agent
- **Responsive Design**: ใช้งานได้ทั้งเดสก์ท็อปและมือถือ
- **Context-Aware**: ดึงบริบทจากโน้ตที่เปิดอยู่
- **Smart Suggestions**: แนะนำคำถามที่เหมาะสม

### 🧠 Memory Graph
- **Node Types**: fact, event, task, context, markdown
- **Edge Types**: causal, temporal, similar, references
- **Auto-Indexing**: จัดทำดัชนีอัตโนมัติเมื่อไฟล์เปลี่ยนแปลง
- **Graph Visualization**: แสดงผลกราฟใน Obsidian

### 🔍 RAG System
- **Mistral Embeddings**: ใช้ mistral-embed (ฟรี)
- **Qdrant Integration**: รองรับทั้ง local และ cloud
- **Semantic Search**: ค้นหาตามความหมาย
- **Hybrid Search**: รวม semantic และ keyword search

### 🎭 Role System
- **Dynamic Roles**: สร้างและจัดการ role ได้เอง
- **Role Templates**: นำเข้า/ส่งออก role template
- **Custom Prompts**: ปรับแต่ง system prompt ได้
- **Role Folder**: จัดเก็บใน `AI Roles/` folder

### ⚡ Performance Features
- **Caching System**: แคชผลลัพธ์เพื่อความเร็ว
- **Batch Processing**: ประมวลผลแบบกลุ่ม
- **Lazy Loading**: โหลดไฟล์เมื่อจำเป็น
- **Memory Optimization**: จัดการหน่วยความจำอัตโนมัติ

### 🤖 Smart Features
- **Auto-Tagging**: แท็กอัตโนมัติตามเนื้อหา
- **Smart Suggestions**: แนะนำงานและการเชื่อมโยง
- **Pattern Detection**: ตรวจจับรูปแบบในข้อมูล
- **Knowledge Gap Analysis**: วิเคราะห์ช่องว่างความรู้

## 📋 คำสั่งที่มีให้ใช้

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `Open AI Chat Interface` | เปิดหน้าต่างแชท AI |
| `Initialize Vault Memory` | สแกนและจัดทำดัชนี vault ทั้งหมด |
| `Test Vault Recall` | ทดสอบความแม่นยำของระบบ |
| `Show Smart Suggestions` | แสดงคำแนะนำอัจฉริยะ |
| `Auto-tag Current Note` | แท็กโน้ตปัจจุบันอัตโนมัติ |
| `Smart Search` | ค้นหาแบบอัจฉริยะ |
| `Export Memory Graph` | ส่งออกกราฟความทรงจำ |
| `Import Memory Graph` | นำเข้ากราฟความทรงจำ |
| `Visualize Memory Graph` | แสดงผลกราฟใน Obsidian |
| `Optimize Memory Usage` | ปรับปรุงการใช้หน่วยความจำ |

## ⚙️ การตั้งค่า

### Mistral API
1. สมัครที่ [Mistral AI](https://mistral.ai/)
2. รับ API key (ฟรี tier มี 1M tokens/เดือน)
3. ใส่ใน Settings > AI MCP Plugin

### Qdrant Setup
#### Local (แนะนำ)
```bash
# ใช้ Docker
docker run -p 6333:6333 qdrant/qdrant

# หรือติดตั้งแบบ standalone
# ดาวน์โหลดจาก https://qdrant.tech/
```

#### Cloud
1. สมัครที่ [Qdrant Cloud](https://cloud.qdrant.io/)
2. สร้าง cluster
3. ใส่ URL และ API key ใน settings

### Custom Cloud Sync (ตัวเลือก)
- ตั้งค่า endpoint สำหรับ sync ข้อมูลไปยัง cloud ส่วนตัว
- รองรับ REST API พร้อม Bearer token authentication

## 🎨 การปรับแต่ง UI

### Mobile Optimization
- ปุ่ม toggle สำหรับ context panel
- Layout ปรับตัวตามขนาดหน้าจอ
- Touch-friendly controls

### Theme Support
- รองรับ light/dark theme
- ปรับตัวตาม Obsidian theme
- High contrast mode support

## 📊 Performance Metrics

### Cache Statistics
- Hit rate tracking
- Memory usage monitoring
- Performance optimization suggestions

### Batch Processing
- Configurable batch size
- Priority-based processing
- Concurrent request limiting

## 🔧 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

**1. Embeddings ไม่ทำงาน**
- ตรวจสอบ Mistral API key
- ตรวจสอบ rate limit (ฟรี tier)

**2. Qdrant connection failed**
- ตรวจสอบว่า Qdrant server ทำงาน
- ตรวจสอบ URL และ port

**3. Chat ไม่ตอบสนอง**
- ตรวจสอบ API keys
- ดู console สำหรับ error messages

**4. Memory usage สูง**
- รัน "Optimize Memory Usage"
- ลด chunk size ใน settings

### Debug Mode
```javascript
// เปิด debug ใน console
window.aiMcpPlugin.performanceOptimizer.getPerformanceMetrics()
```

## 🤝 การพัฒนาต่อ

### Architecture
```
main.ts                 # Main plugin class
├── src/
│   ├── performance.ts  # Performance optimization
│   └── advanced-features.ts # Smart features
├── styles.css         # UI styling
└── ai-mcp-instructions.json # Configuration
```

### Extension Points
- Custom role templates
- Additional embedding providers
- New search algorithms
- UI themes and layouts

## 📄 License

MIT License - ใช้งานและปรับแต่งได้อย่างอิสระ

## 🙏 Credits

- **Obsidian API**: สำหรับ plugin framework
- **Mistral AI**: สำหรับ embeddings
- **Qdrant**: สำหรับ vector database
- **LangChain**: สำหรับ AI integrations

---

## 🚀 เริ่มต้นใช้งาน

1. **ติดตั้งปลั๊กอิน** ตามขั้นตอนข้างต้น
2. **ตั้งค่า API keys** ใน settings
3. **รัน Initialize Vault Memory** เพื่อสแกน vault
4. **เปิด AI Chat** และเริ่มสนทนา!

สำหรับคำถามและการสนับสนุน กรุณาเปิด issue ใน GitHub repository

**Happy Knowledge Management! 🧠✨**

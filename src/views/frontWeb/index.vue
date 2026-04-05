<template>
  <div class="front-web">
    <!-- 导航栏 -->
    <el-header class="header">
      <div class="logo">公司名称</div>
      <el-menu :default-active="activeIndex" class="nav-menu" mode="horizontal" background-color="#fff" text-color="#333" active-text-color="#409EFF">
        <el-menu-item index="home" @click="scrollToSection('home')">首页</el-menu-item>
        <el-menu-item index="about" @click="scrollToSection('about')">关于我们</el-menu-item>
        <el-menu-item index="products" @click="scrollToSection('products')">产品服务</el-menu-item>
        <el-menu-item index="news" @click="scrollToSection('news')">新闻动态</el-menu-item>
        <el-menu-item index="cases" @click="scrollToSection('cases')">客户案例</el-menu-item>
        <el-menu-item index="contact" @click="scrollToSection('contact')">联系我们</el-menu-item>
        <el-menu-item index="recruit" @click="scrollToSection('recruit')">招聘信息</el-menu-item>
      </el-menu>
    </el-header>

    <!-- 首页部分 -->
    <section id="home" class="section home">
      <div class="container">
        <h2>欢迎来到我们的公司</h2>
        <p v-if="companyInfo">{{ companyInfo.description }}</p>
        <p v-else>加载中...</p>
        <el-button type="primary" @click="scrollToSection('about')">了解更多</el-button>
      </div>
    </section>

    <!-- 关于我们 -->
    <section id="about" class="section about">
      <div class="container">
        <h2>关于我们</h2>
        
        <!-- 公司信息 -->
        <el-card v-if="companyInfo" class="company-card">
          <template #header>
            <div class="card-header">
              <span>公司简介</span>
            </div>
          </template>
          <div class="company-content">
            <div v-if="companyInfo.logo" class="logo-img">
              <img :src="companyInfo.logo" alt="公司Logo">
            </div>
            <div class="company-info">
              <h3>{{ companyInfo.name }}</h3>
              <p>{{ companyInfo.description }}</p>
              <p><strong>公司愿景：</strong>{{ companyInfo.vision }}</p>
              <p><strong>公司使命：</strong>{{ companyInfo.mission }}</p>
              <p><strong>企业文化：</strong>{{ companyInfo.culture }}</p>
              <p><strong>发展历程：</strong>{{ companyInfo.history }}</p>
            </div>
          </div>
        </el-card>

        <!-- 团队成员 -->
        <div class="team-section">
          <h3>核心团队</h3>
          <div class="team-list" v-if="teamMembers.length > 0">
            <el-card v-for="member in teamMembers" :key="member.id" class="team-card">
              <div class="team-member">
                <div v-if="member.avatar" class="member-avatar">
                  <img :src="member.avatar" alt="团队成员">
                </div>
                <div class="member-info">
                  <h4>{{ member.name }}</h4>
                  <p class="position">{{ member.position }}</p>
                  <p>{{ member.bio }}</p>
                </div>
              </div>
            </el-card>
          </div>
          <p v-else>暂无团队成员信息</p>
        </div>
      </div>
    </section>

    <!-- 产品服务 -->
    <section id="products" class="section products">
      <div class="container">
        <h2>产品服务</h2>
        
        <!-- 产品 -->
        <div class="product-section">
          <h3>产品列表</h3>
          <div class="product-list" v-if="products.length > 0">
            <el-card v-for="product in products" :key="product.id" class="product-card">
              <div v-if="product.image" class="product-image">
                <img :src="product.image" alt="产品图片">
              </div>
              <div class="product-info">
                <h4>{{ product.name }}</h4>
                <p>{{ product.description }}</p>
                <div v-if="product.features && product.features.length > 0" class="features">
                  <h5>产品特点：</h5>
                  <ul>
                    <li v-for="(feature, index) in product.features" :key="index">{{ feature }}</li>
                  </ul>
                </div>
              </div>
            </el-card>
          </div>
          <p v-else>暂无产品信息</p>
        </div>

        <!-- 服务 -->
        <div class="service-section">
          <h3>服务项目</h3>
          <div class="service-list" v-if="services.length > 0">
            <el-card v-for="service in services" :key="service.id" class="service-card">
              <h4>{{ service.name }}</h4>
              <p>{{ service.description }}</p>
              <div v-if="service.process && service.process.length > 0" class="process">
                <h5>服务流程：</h5>
                <ol>
                  <li v-for="(step, index) in service.process" :key="index">{{ step }}</li>
                </ol>
              </div>
              <p class="price"><strong>价格：</strong>{{ service.price }}</p>
            </el-card>
          </div>
          <p v-else>暂无服务信息</p>
        </div>

        <!-- 解决方案 -->
        <div class="solution-section">
          <h3>解决方案</h3>
          <div class="solution-list" v-if="solutions.length > 0">
            <el-card v-for="solution in solutions" :key="solution.id" class="solution-card">
              <div v-if="solution.image" class="solution-image">
                <img :src="solution.image" alt="解决方案图片">
              </div>
              <div class="solution-info">
                <h4>{{ solution.name }}</h4>
                <p class="industry"><strong>行业：</strong>{{ solution.industry }}</p>
                <p>{{ solution.description }}</p>
              </div>
            </el-card>
          </div>
          <p v-else>暂无解决方案信息</p>
        </div>
      </div>
    </section>

    <!-- 新闻动态 -->
    <section id="news" class="section news">
      <div class="container">
        <h2>新闻动态</h2>
        <div class="news-list" v-if="news.length > 0">
          <el-card v-for="item in news" :key="item.id" class="news-card">
            <div class="news-header">
              <h4>{{ item.title }}</h4>
              <span class="category">{{ item.category }}</span>
            </div>
            <div v-if="item.image" class="news-image">
              <img :src="item.image" alt="新闻图片">
            </div>
            <p class="news-content">{{ item.content.substring(0, 200) }}...</p>
            <p class="publish-date">{{ formatDate(item.publish_date) }}</p>
          </el-card>
        </div>
        <p v-else>暂无新闻信息</p>
      </div>
    </section>

    <!-- 客户案例 -->
    <section id="cases" class="section cases">
      <div class="container">
        <h2>客户案例</h2>
        
        <!-- 案例 -->
        <div class="case-section">
          <h3>成功案例</h3>
          <div class="case-list" v-if="cases.length > 0">
            <el-card v-for="caseItem in cases" :key="caseItem.id" class="case-card">
              <div v-if="caseItem.image" class="case-image">
                <img :src="caseItem.image" alt="案例图片">
              </div>
              <div class="case-info">
                <h4>{{ caseItem.name }}</h4>
                <p class="client"><strong>客户：</strong>{{ caseItem.client }}</p>
                <p class="industry"><strong>行业：</strong>{{ caseItem.industry }}</p>
                <p>{{ caseItem.description }}</p>
              </div>
            </el-card>
          </div>
          <p v-else>暂无案例信息</p>
        </div>

        <!-- 客户评价 -->
        <div class="testimonial-section">
          <h3>客户评价</h3>
          <div class="testimonial-list" v-if="testimonials.length > 0">
            <el-card v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial-card">
              <div class="testimonial-content">
                <p>{{ testimonial.content }}</p>
                <div class="testimonial-footer">
                  <div class="client-info">
                    <h5>{{ testimonial.client_name }}</h5>
                    <p>{{ testimonial.client_company }}</p>
                  </div>
                  <div class="rating">
                    <el-rate v-model="testimonial.rating" disabled :max="5" />
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          <p v-else>暂无客户评价信息</p>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section id="contact" class="section contact">
      <div class="container">
        <h2>联系我们</h2>
        <el-card v-if="contactInfo" class="contact-card">
          <div class="contact-info">
            <div class="contact-item">
              <el-icon class="contact-icon"><Phone /></el-icon>
              <span>{{ contactInfo.phone }}</span>
            </div>
            <div class="contact-item">
              <el-icon class="contact-icon"><Message /></el-icon>
              <span>{{ contactInfo.email }}</span>
            </div>
            <div class="contact-item">
              <el-icon class="contact-icon"><Position /></el-icon>
              <span>{{ contactInfo.address }}</span>
            </div>
            <div class="contact-item">
              <el-icon class="contact-icon"><Timer /></el-icon>
              <span>{{ contactInfo.working_hours }}</span>
            </div>
          </div>
        </el-card>
        <p v-else>暂无联系信息</p>
      </div>
    </section>

    <!-- 招聘信息 -->
    <section id="recruit" class="section recruit">
      <div class="container">
        <h2>招聘信息</h2>
        <div class="job-list" v-if="jobs.length > 0">
          <el-card v-for="job in jobs" :key="job.id" class="job-card">
            <div class="job-header">
              <h4>{{ job.title }}</h4>
              <el-tag :type="job.status === 'open' ? 'success' : 'info'">
                {{ job.status === 'open' ? '招聘中' : '已关闭' }}
              </el-tag>
            </div>
            <div class="job-info">
              <p class="salary"><strong>薪资：</strong>{{ job.salary }}</p>
              <p class="location"><strong>工作地点：</strong>{{ job.location }}</p>
              <div class="requirements">
                <h5>职位要求：</h5>
                <p>{{ job.requirements }}</p>
              </div>
              <div class="responsibilities">
                <h5>工作职责：</h5>
                <p>{{ job.responsibilities }}</p>
              </div>
            </div>
          </el-card>
        </div>
        <p v-else>暂无招聘信息</p>
      </div>
    </section>

    <!-- 页脚 -->
    <el-footer class="footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} 公司名称. 保留所有权利.</p>
      </div>
    </el-footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Phone, Message, Position, Timer } from '@element-plus/icons-vue';
import { 
  companyInfoService, 
  teamMembersService, 
  productsService, 
  servicesService, 
  solutionsService, 
  newsService, 
  casesService, 
  testimonialsService, 
  contactInfoService, 
  jobsService 
} from '@/api/company';

const activeIndex = ref('home');
const companyInfo = ref(null);
const teamMembers = ref([]);
const products = ref([]);
const services = ref([]);
const solutions = ref([]);
const news = ref([]);
const cases = ref([]);
const testimonials = ref([]);
const contactInfo = ref(null);
const jobs = ref([]);

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  try {
    // 获取公司信息
    const companyResult = await companyInfoService.queryAll();
    if (companyResult.list.length > 0) {
      companyInfo.value = companyResult.list[0];
    }

    // 获取团队成员
    const teamResult = await teamMembersService.queryAll();
    teamMembers.value = teamResult.list;

    // 获取产品
    const productResult = await productsService.queryAll();
    products.value = productResult.list;

    // 获取服务
    const serviceResult = await servicesService.queryAll();
    services.value = serviceResult.list;

    // 获取解决方案
    const solutionResult = await solutionsService.queryAll();
    solutions.value = solutionResult.list;

    // 获取新闻
    const newsResult = await newsService.queryAll();
    news.value = newsResult.list;

    // 获取案例
    const caseResult = await casesService.queryAll();
    cases.value = caseResult.list;

    // 获取客户评价
    const testimonialResult = await testimonialsService.queryAll();
    testimonials.value = testimonialResult.list;

    // 获取联系信息
    const contactResult = await contactInfoService.queryAll();
    if (contactResult.list.length > 0) {
      contactInfo.value = contactResult.list[0];
    }

    // 获取招聘信息
    const jobResult = await jobsService.queryAll();
    jobs.value = jobResult.list;
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

const scrollToSection = (sectionId) => {
  activeIndex.value = sectionId;
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN');
};
</script>

<style scoped>
.front-web {
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

/* 导航栏 */
.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-right: 50px;
}

.nav-menu {
  flex: 1;
}

/* 通用部分样式 */
.section {
  padding: 80px 20px;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.home {
  background-color: #f5f7fa;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

h2 {
  font-size: 36px;
  margin-bottom: 40px;
  text-align: center;
  color: #333;
}

h3 {
  font-size: 24px;
  margin: 30px 0 20px;
  color: #409EFF;
}

/* 首页样式 */
.home h2 {
  font-size: 48px;
  margin-bottom: 20px;
}

.home p {
  font-size: 18px;
  margin-bottom: 30px;
  color: #666;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* 关于我们样式 */
.company-content {
  display: flex;
  gap: 30px;
}

.logo-img img {
  width: 200px;
  height: auto;
}

.company-info {
  flex: 1;
}

.team-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.team-member {
  display: flex;
  gap: 20px;
}

.member-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

/* 产品服务样式 */
.product-list,
.service-list,
.solution-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-image img,
.solution-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 15px;
}

/* 新闻动态样式 */
.news-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.news-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin: 10px 0;
}

.publish-date {
  color: #999;
  font-size: 14px;
  margin-top: 10px;
}

/* 客户案例样式 */
.case-list,
.testimonial-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.case-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 15px;
}

.testimonial-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 20px;
}

/* 联系我们样式 */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.contact-icon {
  font-size: 20px;
  color: #409EFF;
}

/* 招聘信息样式 */
.job-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

/* 页脚样式 */
.footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 40px 20px;
  margin-top: 50px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.footer p {
  margin: 0;
  line-height: 1.5;
  font-size: 16px;
  max-width: 100%;
  word-wrap: break-word;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .company-content {
    flex-direction: column;
  }
  
  .team-member {
    flex-direction: column;
    text-align: center;
  }
  
  .member-avatar {
    align-self: center;
  }
  
  .job-list {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }
  
  .logo {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .nav-menu {
    width: 100%;
  }
}
</style>
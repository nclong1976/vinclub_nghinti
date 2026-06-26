import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager, 
  collection, 
  getDocs, 
  writeBatch, 
  doc 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../firebase-applet-config.json";
import { projects, stocks, casinoGames } from "./data";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with robust multi-tab persistent local cache
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager() // Hỗ trợ đồng bộ giữa nhiều tab trình duyệt
  })
}, (firebaseConfig as any).firestoreDatabaseId);

export const seedDatabase = async () => {
  try {
    const batch = writeBatch(db);
    
    projects.forEach(p => {
      batch.set(doc(collection(db, "projects"), p.id), p);
    });
    stocks.forEach(s => {
      batch.set(doc(collection(db, "stocks"), s.symbol), s);
    });
    casinoGames.forEach(g => {
      batch.set(doc(collection(db, "casinoGames"), g.id), g);
    });
    
    // Check if articles collection has any documents
    const articlesSnapshot = await getDocs(collection(db, "articles"));
    if (articlesSnapshot.size < 14) {
      const initialArticles = [
        {
          id: 'art-0',
          category: 'Thông báo',
          title: 'VinClub Hợp Tác Chiến Lược Với Hơn 10 Đối Tác Hàng Đầu',
          excerpt: 'VinClub - Chương trình Khách hàng thân thiết của Tập đoàn Vingroup công bố hợp tác chiến lược với hơn 10 đối tác hàng đầu trong các lĩnh vực thiết yếu của đời sống.',
          content: 'VinClub - Chương trình Khách hàng thân thiết của Tập đoàn Vingroup công bố hợp tác chiến lược với hơn 10 đối tác hàng đầu trong các lĩnh vực thiết yếu của đời sống như ngân hàng, công nghệ, thương mại điện tử, bán lẻ và du lịch.\n\nCác đối tác của VinClub gồm Vietcombank, BIDV, Techcombank, HDBank, Vikki, Galaxy Pay, Galaxy Joy (tài chính – ngân hàng); VNPT, Viettel Digital - Viettel Money, FPT – Happy Club (công nghệ – viễn thông); Shopee, UrBox (thương mại điện tử – bán lẻ); Klook (du lịch – dịch vụ).\n\nThông qua việc hợp tác chiến lược, thành viên VinClub có thể đổi điểm VPoint tiêu dùng và tối ưu hóa lợi ích từ các Chương trình khách hàng thân thiết của các đối tác.\n\nThành viên có thể chuyển đổi điểm hai chiều như quy đổi VPoint (giá trị vô thời hạn) lấy thưởng vé máy bay Vietjet hoặc chuyển điểm thưởng Vietcombank thành điểm tiêu dùng đi Xanh SM…\n\nVPoint cũng có thể quy đổi thành voucher tiêu dùng hơn 200 thương hiệu lớn qua UrBox như Starbucks, Pizza 4P’s, KOI Thé, GoGi House,… hoặc thanh toán cho nhiều dịch vụ tiện ích như nạp tiền điện thoại Vinaphone, thanh toán cước viễn thông Viettel; mua máy tính, điện thoại tại FPT Shop; mua thuốc tại chuỗi nhà thuốc Long Châu,…\n\nBên cạnh quyền lợi tích điểm và tiêu điểm VPoint linh hoạt, thành viên VinClub còn được hưởng đặc quyền tài chính từ các ngân hàng, được tiên phong trải nghiệm chương trình cấp tín dụng thiết kế riêng theo hạng thẻ với lãi suất hấp dẫn và thời gian nhanh chóng từ Vietcombank, BIDV, Techcombank, HDBank, Vikki…',
          imageUrl: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?q=80&w=800&auto=format&fit=crop',
          status: 'published',
          date: '18/06/2025',
          author: 'VOV.VN',
          isPinned: true,
          createdAt: Date.now() - 100000000
        },
        {
          id: 'art-1',
          category: 'Dự án',
          title: 'Khởi động Siêu Phức Hợp Nghỉ Dưỡng Vinpearl Luxury Phú Quốc Giai Đoạn 3',
          excerpt: 'Bước tiến chiến lược nâng tầm vị thế nghỉ dưỡng siêu sang, mở ra đặc quyền góp vốn nhận cam kết lợi nhuận 15%/năm dành riêng cho hội viên VIP.',
          content: 'VinClub chính thức công bố khởi động giai đoạn 3 của siêu dự án phức hợp nghỉ dưỡng đẳng cấp quốc tế Vinpearl Luxury Phú Quốc. Tọa lạc tại vị trí độc tôn ôm trọn dải bờ biển bãi Dài hoang sơ tuyệt mỹ, dự án bao gồm 120 căn biệt thự biển tổng thống siêu sang và tổ hợp spa, casino quốc tế, bến du thuyền cao cấp.\n\nĐược thiết kế bởi các kiến trúc sư hàng đầu thế giới từ WATG (Singapore), Vinpearl Luxury Phú Quốc giai đoạn 3 thiết lập chuẩn mực mới về sự xa hoa và riêng tư tuyệt đối. Toàn bộ các công trình đều tích hợp các công nghệ quản lý vận hành xanh tiết kiệm năng lượng thông minh chuẩn LEED toàn cầu.',
          imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop',
          status: 'published',
          date: '24/06/2026',
          author: 'Ban Điều Hành Quỹ Đầu Tư',
          isPinned: false,
          createdAt: Date.now() - 50000000
        },
        {
          id: 'art-2',
          category: 'Thị trường',
          title: 'Báo Cáo Tài Chính Quý II/2026: Đột Phá Lợi Nhuận Từ Danh Mục Đầu Tư Xanh',
          excerpt: 'Hội viên VIP sẽ nhận được suất góp vốn sinh lời cam kết lên tới 15% mỗi năm cùng 30 đêm nghỉ mát thượng lưu.',
          content: 'Báo cáo tài chính Quý II năm 2026 của Quỹ đầu tư VinClub ghi nhận sự bứt phá ngoạn mục với tổng doanh thu đạt 1,250 tỷ VNĐ, tăng trưởng 28.6% so với cùng kỳ năm trước. Trong đó, mảng danh mục đầu tư trọng điểm vào Bất động sản tích hợp năng lượng sạch và khu công nghiệp sinh thái đạt lợi nhuận ròng vượt chỉ tiêu đề ra là 35%.',
          imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop',
          status: 'published',
          date: '22/06/2026',
          author: 'Phòng Phân Tích Chiến Lược',
          isPinned: false,
          createdAt: Date.now() - 25000000
        },
        {
          id: 'art-3',
          category: 'Công nghệ',
          title: 'VinFast Ra Mắt Dòng Xe Điện Lái Tự Động Thông Minh Mới Tại Thị Trường Bắc Mỹ',
          excerpt: 'Mẫu xe SUV điện cao cấp tích hợp hệ thống ADAS nâng cấp cấp độ 3 mang đến sự vượt trội về an toàn và trải nghiệm tự động lái thông minh hoàn hảo.',
          content: 'VinFast chính thức giới thiệu dải sản phẩm ô tô điện thông minh mới được trang bị gói hỗ trợ lái nâng cao ADAS cấp độ 3 tại Triển lãm Ô tô Quốc tế Bắc Mỹ.\n\nSự kiện đánh dấu bước phát triển nhảy vọt của VinFast trong việc làm chủ các công nghệ lõi như học máy, nhận diện làn đường thời gian thực và tự động đỗ xe thông minh. Hãng cũng công bố mở rộng hợp tác với các nhà cung cấp chip hàng đầu thế giới để phát triển hệ điều hành xe điện thế hệ tiếp theo.',
          imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800&auto=format&fit=crop',
          status: 'published',
          date: '20/06/2026',
          author: 'VinFast Toàn Cầu',
          isPinned: false,
          createdAt: Date.now() - 30000000
        },
        {
          id: 'art-4',
          category: 'Y tế',
          title: 'Vinmec Ký Kết Hợp Tác Chiến Lược Toàn Diện Với Cleveland Clinic Hoa Kỳ',
          excerpt: 'Nâng cấp tiêu chuẩn quản lý lâm sàng và dịch vụ chăm sóc sức khỏe theo chuẩn mực khắt khe nhất thế giới, đem đến cơ hội điều trị quốc tế cho bệnh nhân Việt Nam.',
          content: 'Hệ thống Y tế Vinmec đã chính thức hoàn tất thỏa thuận hợp tác chiến lược toàn diện kéo dài 5 năm với Cleveland Clinic - một trong hai hệ thống bệnh viện tốt nhất tại Mỹ.\n\nTheo đó, Cleveland Clinic sẽ hỗ trợ Vinmec xây dựng các trung tâm xuất sắc về Tim mạch, Ung bướu và Phẫu thuật cột sống. Đồng thời, hai bên sẽ thiết lập hệ thống hội chẩn trực tuyến 24/7 để mang đến các phác đồ điều trị tiên tiến nhất thế giới ngay tại Việt Nam.',
          imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
          status: 'published',
          date: '15/06/2026',
          author: 'Vinmec Health',
          isPinned: false,
          createdAt: Date.now() - 35000000
        },
        {
          id: 'art-5',
          category: 'Giáo dục',
          title: 'Vinschool Đạt Kiểm Định Chất Lượng Giáo Dục Quốc Tế CIS Cho Toàn Hệ Thống',
          excerpt: 'Cột mốc tự hào khẳng định chất lượng giảng dạy, cơ sở vật chất và môi trường học đường đạt tiêu chuẩn cao nhất của Hội đồng các Trường Quốc tế.',
          content: 'Hội đồng các Trường Quốc tế (CIS) đã chính thức công bố cấp chứng nhận kiểm định chất lượng toàn diện cho toàn bộ các trường trung học phổ thông thuộc hệ thống Vinschool tại Việt Nam.\n\nĐể đạt được chứng nhận này, Vinschool đã trải qua quy trình đánh giá nghiêm ngặt gồm hơn 80 tiêu chí chất lượng quốc tế từ chương trình đào tạo, phương pháp sư phạm, cho đến công tác an toàn và bảo vệ học sinh. Đây là bước đệm lớn giúp học sinh Vinschool dễ dàng tiếp cận các trường đại học danh tiếng thế giới.',
          imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
          status: 'published',
          date: '10/06/2026',
          author: 'Vinschool News',
          isPinned: false,
          createdAt: Date.now() - 40000000
        },
        {
          id: 'art-6',
          category: 'Môi trường',
          title: 'Vingroup Công Bố Cam Kết Phát Thải Ròng Bằng 0 (Net Zero) Vào Năm 2040',
          excerpt: 'Lộ trình phát triển bền vững toàn diện từ sản xuất xanh, giao thông xanh đến việc tối ưu hóa năng lượng tái tạo tại tất cả tổ hợp công trình.',
          content: 'Tập đoàn Vingroup công bố Báo cáo Phát triển Bền vững năm nay với cam kết mạnh mẽ đạt mức phát thải ròng bằng không (Net Zero) vào năm 2040.\n\nKế hoạch hành động bao gồm việc điện hóa toàn bộ phương tiện giao thông nội bộ, lắp đặt hệ thống điện mặt trời mái nhà tại tất cả trung tâm thương mại Vincom và resort Vinpearl, đồng thời áp dụng công nghệ tiết kiệm năng lượng chuẩn LEED quốc tế cho tất cả các dự án Vinhomes xây dựng mới kể từ năm 2026.',
          imageUrl: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?q=80&w=800&auto=format&fit=crop',
          status: 'published',
          date: '08/06/2026',
          author: 'Vingroup Green',
          isPinned: false,
          createdAt: Date.now() - 45000000
        },
        {
          id: 'art-7',
          category: 'Kinh doanh',
          title: 'Bàn Giao Kỷ Lục Hơn 50.000 Xe Điện VinFast Toàn Cầu Trong Năm Qua',
          excerpt: 'Sự tăng trưởng vượt bậc khẳng định vị thế dẫn đầu trong cuộc cách mạng xe điện tại Việt Nam và sự đón nhận tích cực của thị trường quốc tế.',
          content: 'VinFast vừa công bố báo cáo kết quả kinh doanh với số lượng bàn giao đạt kỷ lục hơn 50.000 xe ô tô điện trên toàn cầu trong năm tài chính vừa qua.\n\nSự tăng trưởng vượt bậc được thúc đẩy bởi doanh số mạnh mẽ từ thị trường nội địa với các dòng xe quốc dân VF 3, VF 5 cũng như việc mở rộng nhanh chóng mạng lưới phân phối tại các thị trường trọng điểm như Mỹ, Canada, Indonesia, Philippines và các quốc gia Châu Âu.',
          imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop',
          status: 'published',
          date: '05/06/2026',
          author: 'Ban Quan Hệ Cổ Đông',
          isPinned: false,
          createdAt: Date.now() - 48000000
        },
        {
          id: 'art-8',
          category: 'Sự kiện',
          title: 'Đặc Quyền Hội Viên: Lễ Vinh Danh Đối Tác Tri Ân Thành Viên Quỹ Tiết Kiệm Vàng',
          excerpt: 'Đêm tiệc thượng lưu vinh danh các nhà quản lý xuất sắc và đối tác chiến lược hàng đầu cùng chương trình cam kết lợi nhuận sinh lời vàng bền vững.',
          content: 'Tại siêu phức hợp nghỉ dưỡng Vinpearl Luxury Nha Trang, Tập đoàn đã long trọng tổ chức Đêm tiệc Tri ân & Vinh danh đối tác đồng hành cùng sự phát triển bền vững của Quỹ Tiết Kiệm Vàng.\n\nSự kiện quy tụ hơn 300 khách mời cao cấp là các quản lý cấp cao và các nhà đầu tư chiến lược. Tại đây, ban điều hành đã chia sẻ về các giải pháp tài chính đặc quyền tối ưu hóa dòng vốn và bảo toàn tài sản, cùng chính sách phân bổ lợi ích đặc thù cho các thành viên VIP.',
          imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
          status: 'published',
          date: '01/06/2026',
          author: 'VinClub Ban Tổ Chức',
          isPinned: false,
          createdAt: Date.now() - 52000000
        },
        {
          id: 'art-9',
          category: 'Bất động sản',
          title: 'Vinhomes Khởi Công Đại Đô Thị Sinh Thải Thông Minh Ocean Park 3',
          excerpt: 'Kiến tạo chuẩn mực sống thượng lưu mới với kỳ quan biển hồ nước mặn nhân tạo đỉnh cao quy mô lên đến hàng chục hecta tại phía Đông thủ đô.',
          content: 'Công ty Cổ phần Vinhomes đã chính thức động thổ xây dựng siêu dự án Đại đô thị Vinhomes Ocean Park 3 - bến cảng thượng lưu lớn nhất phía Đông thủ đô.\n\nDự án tích hợp các công nghệ thông minh AI quản lý tòa nhà, bãi đỗ xe tự động cùng hệ sinh thái tiện ích hoàn chỉnh gồm trường học liên cấp Vinschool, bệnh viện Vinmec, trung tâm thương mại Vincom Mega Mall và công viên sóng biển khổng lồ Royal Wave Park.',
          imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
          status: 'published',
          date: '28/05/2026',
          author: 'Vinhomes News',
          isPinned: false,
          createdAt: Date.now() - 55000000
        },
        {
          id: 'art-10',
          category: 'Nghỉ dưỡng',
          title: 'Vinpearl Hợp Tác Quản Lý Vận Hành Với Tập Đoàn Marriott International',
          excerpt: 'Nâng tầm chất lượng dịch vụ nghỉ dưỡng Việt Nam lên bản đồ du lịch cao cấp toàn cầu thông qua hệ thống quản lý chuẩn mực quốc tế.',
          content: 'Công ty Cổ phần Vinpearl đã ký kết thỏa thuận hợp tác chiến lược nâng tầm quản lý với tập đoàn khách sạn hàng đầu thế giới Marriott International để vận hành chuỗi 7 resort và khách sạn cao cấp của Vinpearl.\n\nSự hợp tác này mang lại những tiêu chuẩn quản lý, đào tạo và chăm sóc khách hàng hàng đầu thế giới của Marriott kết hợp cùng sự am hiểu văn hóa bản địa sâu sắc của Vinpearl, khẳng định vị thế điểm đến quốc tế xuất sắc của hệ sinh thái du lịch Vinpearl.',
          imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop',
          status: 'published',
          date: '24/05/2026',
          author: 'Vinpearl Press',
          isPinned: false,
          createdAt: Date.now() - 60000000
        },
        {
          id: 'art-11',
          category: 'Cộng đồng',
          title: 'Quỹ Thiện Tâm Tài Trợ 1.000 Tỷ Đồng Xây Dựng Trường Học Vùng Cao',
          excerpt: 'Hành trình nhân ái bền bỉ vì thế hệ tương lai đất nước, mang lại ánh sáng tri thức và điều kiện học tập an toàn cho hàng ngàn trẻ em khó khăn.',
          content: 'Quỹ Thiện Tâm thuộc Tập đoàn Vingroup chính thức phát động chương trình xây dựng và cải tạo 100 điểm trường mầm non và tiểu học tại các tỉnh biên giới phía Bắc trong năm học 2026-2027.\n\nVới tổng ngân sách ước tính 1.000 tỷ đồng, chương trình không chỉ tài tạo phòng học kiên cố chống rét mà còn trang bị thư viện thông minh, máy tính kết nối internet cùng hệ thống nước sạch học đường cho các em nhỏ vùng cao.',
          imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
          status: 'published',
          date: '20/05/2026',
          author: 'Quỹ Thiện Tâm',
          isPinned: false,
          createdAt: Date.now() - 65000000
        },
        {
          id: 'art-12',
          category: 'Công nghệ',
          title: 'VinBigData Ra Mắt Trợ Lý Ảo ViGPT Tích Hợp Trí Tuệ Nhân Tạo Tạo Sinh',
          excerpt: 'Trợ lý ảo thuần Việt đầu tiên sở hữu khả năng suy luận ngôn ngữ tự nhiên vượt trội, tối ưu hóa toàn diện trải nghiệm người dùng Việt.',
          content: 'Công ty Cổ phần VinBigData thuộc Tập đoàn Vingroup đã chính thức công bố ra mắt phiên bản thương mại của trợ lý ảo ViGPT tích hợp mô hình ngôn ngữ lớn (LLM) do người Việt làm chủ.\n\nViGPT có khả năng trò chuyện, tóm tắt văn bản và tư vấn nghiệp vụ tài chính với độ chính xác và an toàn thông tin cao vượt trội. Công nghệ này sẽ sớm được tích hợp trên các dòng xe điện VinFast để nâng tầm trợ lý giọng nói trên xe.',
          imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
          status: 'published',
          date: '15/05/2026',
          author: 'VinBigData',
          isPinned: false,
          createdAt: Date.now() - 70000000
        },
        {
          id: 'art-13',
          category: 'Khoa học',
          title: 'Tuần Lễ Khoa Học Công Nghệ VinFuture Lần Thứ 5 Chính Thức Khai Mạc',
          excerpt: 'Quy tụ hàng trăm nhà khoa học lỗi lạc hàng đầu thế giới tham gia thảo luận các giải pháp khoa học đột phá phục hưng và kiến tạo tương lai hành tinh.',
          content: 'Tuần lễ Khoa học Công nghệ và Lễ trao giải thưởng Khoa học toàn cầu VinFuture lần thứ 5 chính thức khai mạc tại Nhà hát Lớn Hà Nội.\n\nVới chủ đề "Khoa học vì Sự Sống Bền Vững", giải thưởng năm nay nhận được số lượng đề cử kỷ lục từ hơn 80 quốc gia. Các công trình tranh giải tập trung vào các lĩnh vực năng lượng tái tạo mới, y học chính xác, công nghệ sinh học nông nghiệp thích ứng biến đổi khí hậu.',
          imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
          status: 'published',
          date: '10/05/2026',
          author: 'Hội Đồng VinFuture',
          isPinned: false,
          createdAt: Date.now() - 75000000
        }
      ];
      initialArticles.forEach(art => {
        batch.set(doc(collection(db, "articles"), art.id), art);
      });
    }
    
    // Always write the Viettel IDC & Vingroup partnership article so it is updated and available in real-time
    const viettelArtRef = doc(db, "articles", "art-viettel-vingroup");
    batch.set(viettelArtRef, {
      id: 'art-viettel-vingroup',
      category: 'Sự kiện',
      title: 'CỘNG HƯỞNG SỨC MẠNH: VIETTEL IDC VÀ VINGROUP BẮT TAY NÂNG CẤP TOÀN DIỆN HỆ SINH THÁI VINCLUB',
      excerpt: 'Sự kiện bàn giao dự án tích hợp và tối ưu hóa nền tảng kỹ thuật giữa Viettel IDC và Vingroup không chỉ đánh dấu một cột mốc quan trọng trong tiến trình hợp tác song phương, mà còn là minh chứng rõ nét cho xu hướng cộng hưởng sức mạnh giữa các doanh nghiệp dẫn dắt thị trường nhằm thúc đẩy nền kinh tế số.',
      content: `Sự kiện bàn giao dự án tích hợp và tối ưu hóa nền tảng kỹ thuật giữa Viettel IDC và Vingroup không chỉ đánh dấu một cột mốc quan trọng trong tiến trình hợp tác song phương, mà còn là minh chứng rõ nét cho xu hướng cộng hưởng sức mạnh giữa các doanh nghiệp dẫn dắt thị trường nhằm thúc đẩy nền kinh tế số.

### Sứ mệnh vì cộng đồng và bài toán tối ưu hạ tầng
Sứ mệnh cốt lõi của Tập đoàn Vingroup luôn hướng về mục tiêu “Vì một cuộc sống tốt đẹp hơn cho người Việt”, điều này được thể hiện rõ nét qua các sản phẩm và dịch vụ mang lại giá trị thực sự cho cộng đồng. Tập đoàn cam kết phát triển bền vững, gắn kết chặt chẽ giữa lợi ích kinh doanh và lợi ích xã hội, luôn đặt con người vào vị trí trung tâm của mọi hoạt động chiến lược.

Dự án hợp tác lần này tập trung vào việc tận dụng tối đa thế mạnh về cơ sở hạ tầng, công nghệ tiên tiến cùng kinh nghiệm vận hành dày dạn của Viettel IDC – một trong những nhà cung cấp dịch vụ trung tâm dữ liệu và điện toán đám mây hàng đầu tại Việt Nam. Mục tiêu chính là phát triển và tối ưu hóa toàn diện nền tảng kỹ thuật cho Vinclub, một hệ sinh thái dịch vụ tiện ích quan trọng hàng đầu của Vingroup.

Nhằm đảm bảo tính chuẩn xác và hiệu quả cao nhất, dự án được giao trực tiếp cho ông Nguyễn Văn Chiến, Trưởng phòng Kỹ thuật và Vận hành của Viettel IDC, chịu trách nhiệm quản lý triển khai và đảm bảo hoạt động kỹ thuật luôn ổn định, an toàn tuyệt đối.

### Góc nhìn chuyên gia: Đảm bảo bài toán kỹ thuật và an toàn dữ liệu
Là người trực tiếp điều hành và chịu trách nhiệm cao nhất về mặt công nghệ cho dự án, ông Nguyễn Văn Chiến, Trưởng phòng Kỹ thuật và Vận hành của Viettel IDC khẳng định:

"Việc tích hợp và tối ưu hóa hệ thống cho một hệ sinh thái lớn như Vinclub đòi hỏi sự chuẩn xác tuyệt đối về mặt kiến trúc dữ liệu và khả năng chịu tải. Chúng tôi không chỉ cung cấp hạ tầng điện toán đám mây thuần túy, mà còn triển khai các giải pháp an toàn thông tin chuyên sâu, tối ưu hóa luồng xử lý để đảm bảo hệ thống luôn vận hành với độ trễ thấp nhất, sẵn sàng đáp ứng lưu lượng truy cập khổng lồ từ người dùng một cách ổn định và an toàn tuyệt đối."

### Tầm nhìn chiến lược từ ban lãnh đạo
Hợp tác này không chỉ đơn thuần là sự kết hợp về mặt công nghệ, mà còn phản ánh tầm nhìn chiến lược sâu rộng của cả hai đơn vị trong việc chủ động đổi mới mô hình hoạt động, đồng thời mở rộng mạnh mẽ hệ sinh thái dịch vụ. Hai bên cam kết đồng hành chặt chẽ để mang lại trải nghiệm khách hàng vượt trội và kiến tạo những giá trị đột phá cho người tiêu dùng Việt Nam.

Phát biểu tại buổi lễ, bà Trần Thị Thu Phương, Giám đốc Điều hành (CEO) của Vinclub cho biết:

"Sự hợp tác giữa Viettel IDC và Vingroup là bước đi chiến lược, hoàn toàn phù hợp với định hướng của Tổng công ty trong việc đổi mới mô hình hoạt động, mở rộng hệ sinh thái dịch vụ tiện ích gắn liền với xu hướng công nghệ toàn cầu và mục tiêu phát triển bền vững, qua đó trực tiếp gia tăng giá trị phục vụ người dân trên toàn quốc."

Cũng theo bà Trần Thị Thu Phương, việc bắt tay với một đối tác uy tín, sở hữu năng lực công nghệ mạnh mẽ như Viettel IDC giúp Vingroup tiếp cận nhanh chóng với các giải pháp kỹ thuật tiên tiến nhất, tối ưu hóa chi phí vận hành hệ thống. Từ đó, tập đoàn có thể tập trung nguồn lực tối đa vào việc phát triển các dịch vụ lõi, nâng cao chất lượng dịch vụ và tối ưu hóa mức độ hài lòng của khách hàng.

### Sức mạnh cộng hưởng từ hai tập đoàn hàng đầu
Sự kết hợp mang tính chiến lược này hứa hẹn sẽ đem lại những lợi ích to lớn và thiết thực cho cả hai doanh nghiệp cũng như toàn cộng đồng.

Viettel IDC, với hạ tầng mạng lưới băng thông rộng khắp, hệ thống trung tâm dữ liệu đạt tiêu chuẩn quốc tế và kinh nghiệm vận hành chuyên sâu, sẽ là bệ phóng vững chắc đảm bảo cho hệ thống Vinclub vận hành ổn định, an toàn bảo mật và có khả năng mở rộng quy mô linh hoạt theo nhu cầu thị trường.

Vingroup, với vị thế là một trong những tập đoàn kinh tế tư nhân đa ngành hàng đầu Việt Nam, sở hữu hệ sinh thái sản phẩm dịch vụ cực kỳ đa dạng cùng tệp khách hàng trung thành khổng lồ, sẽ là đối tác chiến lược hoàn hảo giúp Viettel IDC tiếp tục mở rộng thị phần và gia tăng giá trị cho các dịch vụ số của mình.

Sự kiện bàn giao dự án lần này là minh chứng rõ nét cho thấy: Sự cộng hưởng sức mạnh giữa các doanh nghiệp dẫn đầu hoàn toàn có thể tạo ra những giá trị mới mang tính đột phá, đóng góp tích cực vào sự phát triển chung của nền kinh tế số nước nhà.`,
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      status: 'published',
      date: '25/06/2026',
      author: 'VinClub News',
      isPinned: true,
      createdAt: Date.now()
    });

    // Seed notifications collection if it has fewer than 5 documents
    const notifsSnapshot = await getDocs(collection(db, "notifications"));
    if (notifsSnapshot.size < 5) {
      const initialNotifications = [
        {
          id: 'notif-1',
          title: 'Đặc Quyền Hội Viên Thượng Lưu',
          content: 'Chào mừng quý khách đến với VinClub - Hệ sinh thái tinh hoa Vingroup. Đặc quyền nâng hạng Thẻ Đen VIP đã chính thức được áp dụng cho tài khoản của bạn, mở khóa các chính sách sinh lời vượt trội, tích điểm VPoint không giới hạn và các suất nghỉ dưỡng cao cấp tại Vinpearl Luxury.',
          type: 'privilege',
          date: '25/06/2026',
          createdAt: Date.now()
        },
        {
          id: 'notif-2',
          title: 'Cộng hưởng Sức mạnh: Viettel IDC & Vingroup',
          content: 'Sự kiện bàn giao dự án nâng cấp toàn diện hạ tầng điện toán đám mây cho hệ sinh thái VinClub đã hoàn thành xuất sắc dưới sự giám sát kỹ thuật của ông Nguyễn Văn Chiến (Viettel IDC) và chỉ đạo chiến lược của CEO Trần Thị Thu Phương (VinClub). Nền tảng kỹ thuật mới giúp cải thiện tốc độ tải trang 300% và bảo mật thông tin tối đa.',
          type: 'event',
          date: '25/06/2026',
          createdAt: Date.now() - 3600000
        },
        {
          id: 'notif-3',
          title: 'Nhận Ngay 1,000 VPoint Thưởng Chào Mừng',
          content: 'VinClub đã cộng trực tiếp 1,000 VPoint (trị giá vô thời hạn) vào tài khoản tiêu dùng của quý khách. Bạn có thể sử dụng VPoint để thanh toán cước viễn thông Viettel, mua sắm tại FPT Shop, đổi voucher ẩm thực tại Starbucks, Pizza 4Ps qua đối tác UrBox, hoặc quy đổi sang dặm bay Vietjet Air.',
          type: 'promotion',
          date: '24/06/2026',
          createdAt: Date.now() - 86400000
        },
        {
          id: 'notif-4',
          title: 'Khởi Động Lái Thử Siêu Xe Điện VinFast VF 9 ADAS Cấp Độ 3',
          content: 'VinFast chính thức mở cổng đăng ký đặc quyền trải nghiệm lái thử mẫu SUV điện cao cấp VF 9 tích hợp công nghệ lái tự động thông minh cấp độ 3 tại thị trường Việt Nam trước khi bàn giao quốc tế. Số lượng đăng ký ưu tiên có hạn dành riêng cho Hội viên Thượng Lưu VinClub.',
          type: 'news',
          date: '22/06/2026',
          createdAt: Date.now() - 3 * 86400000
        },
        {
          id: 'notif-5',
          title: 'Dịch Vụ Khám Chuyên Gia Cleveland Clinic Tại Vinmec',
          content: 'Hệ thống y tế Vinmec kích hoạt đường dây nóng 24/7 kết nối hội chẩn trực tiếp với các giáo sư hàng đầu tại Cleveland Clinic (Hoa Kỳ). Thành viên hạng Vàng và Kim Cương của VinClub được miễn phí 100% phí đăng ký hội chẩn ban đầu.',
          type: 'privilege',
          date: '20/06/2026',
          createdAt: Date.now() - 5 * 86400000
        }
      ];
      initialNotifications.forEach(notif => {
        batch.set(doc(collection(db, "notifications"), notif.id), notif);
      });
    }

    await batch.commit();
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};


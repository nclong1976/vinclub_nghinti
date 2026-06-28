import { ArrowLeft, Share2, Clock, Eye, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, useScroll, useSpring } from 'motion/react';
import { useRef, useContext } from 'react';
import { UserContext } from './UserContext';
import viettelIdcImage from '../assets/images/regenerated_image_1782460662494.jpg';
import vinfastIcon from '../assets/images/logo-vinfast-1.png';

export default function NewsDetailView({ onBack, newsId }: { onBack: () => void, newsId: string | null }) {
  const articles: Record<string, any> = {
    'vf8_2022': {
      title: 'Dấu ấn VF 8 2022: Ô tô điện Việt Nam vươn tầm thế giới',
      date: '25 Th06, 2026',
      author: 'VinFast News',
      views: '12.5K',
      heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyCc4Qoq8kyofdXBrLbmR8ddJwJ9-2DPWzDAbrNZZw4q_MoGr1YJVhHZiyOyXdpvpXPb4IN6HKlPvY-EvdqlRkhzt5QXa01EKyRkTJk0UPIrC9lIYL4PkYpnlYgGhQQPKlUrw4_iUQEwOS6rg8ygp9JjELCxtG7rlyCAR4e90sPlOWlAIy9LvjE7UZcrAflzVxVGmwG71pQN92-4dMJSxA6W3DAgkpHAwTzpPNXo4EizkvEmRuowlnHgF-A2wBKekCIHXiTDT6nn0',
      content: `
Dấu ấn VF 8 2022 thể hiện rõ nét qua hàng loạt sự kiện như bàn giao, lái thử, tham gia các cuộc triển lãm danh tiếng và xuất khẩu quốc tế. Cùng điểm lại những sự kiện giúp VinFast VF 8 trở thành mẫu ô tô điện ấn tượng tại thị trường trong nước và trên Toàn cầu.

Không chỉ xuất hiện ấn tượng tại các sự kiện lái thử, bàn giao ở Việt Nam, VinFast VF 8 còn “ghi điểm” với người tiêu dùng quốc tế nhờ những ưu điểm vượt trội. Với những dấu ấn VF 8 2022 được ghi nhận, mẫu eSUV hạng D được kỳ vọng là “nhân tố” tiềm năng trong ngành công nghiệp ô tô toàn cầu.

### 1. Dấu ấn VF 8 2022 : Đưa ô tô điện đến gần hơn với người dùng Việt

Chính thức mở cọc vào tháng 1/2022, VinFast VF 8 nhận được sự ủng hộ mạnh mẽ từ cộng đồng yêu xe điện Việt Nam. Đặc biệt, với chương trình “VinFirst - Người tiên phong tri ân người tiên phong” cùng nhiều ưu đãi hấp dẫn, mẫu eSUV hạng D VF 8 đã nhận được trung bình gần 2.000 đơn đặt hàng mỗi giờ trong vòng 48h đầu mở cọc.

Nhằm mang đến cho người dùng trải nghiệm thực tế về mẫu ô tô điện thông minh Toàn cầu, VinFast tổ chức chuỗi sự kiện lái thử trải dài từ Bắc vào Nam. Với thiết kế nổi bật, VinFast VF 8 thu hút sự quan tâm của đông đảo người tham gia sự kiện Xếp xe kỷ lục hình bản đồ Việt Nam tại Đồ Sơn - Hải Phòng.

Không chỉ dừng lại ở việc tận “mục sở thị” những đường nét nội - ngoại thất, VF 8 tiếp tục đến gần hơn với người dùng Việt qua sự kiện “Nhà xanh xe điện - mở lối tương lai” tại Hà Nội và TP. Hồ Chí Minh vào cuối tháng 7/2022.

Thông qua chuỗi sự kiện trưng bày và lái thử trên Toàn quốc, VinFast VF 8 “lăn bánh” tới 7 tỉnh, thành phố: Hải Phòng, Quảng Ninh, Thanh Hóa, Nghệ An, Bình Dương, Cần Thơ và Đà Nẵng. Với thiết kế thời thượng, khả năng vận hành vượt trội cùng những tính năng thông minh đón đầu xu hướng, VF 8 nhận được những phản hồi tích cực từ những chuyên gia, cộng đồng yêu xe điện và người tiêu dùng. Đây được xem là bước tiến của VinFast trong việc đưa mẫu xe điện thông minh tới gần hơn với người tiêu dùng Việt.

Từ những nét phác thảo đầu tiên, VinFast đã biến VF 8 trở thành sản phẩm ô tô điện thông minh, chất lượng, đẳng cấp Toàn cầu. Kể từ khi mở cọc, chỉ sau 9 tháng, VF 8 đã chính thức hoàn thiện và tìm thấy những chủ nhân đầu tiên. 

Với sự nỗ lực không ngừng nghỉ, ngày 20/11/2022, 1000 chiếc xe VF 8 tiếp tục được vận chuyển tới các showroom/NPP để bàn giao tới tay khách hàng Việt. 

Mới đây, ngày 22/12/2022, VinFast VF 8 đã được vinh danh là “Ngôi sao mới” tại Giải thưởng Car Awards 2022 - một trong những chương trình bình chọn ô tô uy tín nhất Việt Nam. Đây là minh chứng rõ nét cho chất lượng đẳng cấp, công nghệ dẫn đầu của mẫu ô tô điện thông minh Toàn cầu. 

Thông qua hàng loạt sự kiện ấn tượng năm 2022, VinFast VF 8 đã “lăn bánh” trên khắp dải đất hình chữ S. Với nhiều ưu thế về thiết kế, vận hành, tính năng thông minh, VF 8 không chỉ mang tới cho khách hàng trải nghiệm về mẫu xe lý tưởng mà còn khẳng định năng lực sản xuất của VinFast. 

### 2. VinFast VF 8 2022 - hành trình đưa ô tô điện Việt Nam vươn ra quốc tế

Dấu ấn VF 8 2022 còn được thể hiện rõ nét qua các cột mốc ấn tượng trên trường quốc tế. Kể từ khi ra mắt thị trường, VinFast VF 8 liên tục “góp mặt” tại các sự kiện trưng bày, triển lãm danh tiếng thế giới. Điều này không chỉ khẳng định độ hoàn thiện cao của mẫu eSUV hạng D mà còn cho thấy vị thế của ngành công nghiệp ô tô Việt Nam trên Toàn cầu. 

Theo đó, trong năm 2022, VinFast VF 8 tiếp tục tham dự hàng loạt những sự kiện triển lãm ô tô, cụ thể:

**Tháng 1/ 2022: VF 8 được trưng bày tại triển lãm CES 2022**
Triển lãm CES là nơi hội tụ những xu hướng công nghệ của tương lai với sự góp mặt của nhiều nhà sản xuất nổi tiếng thế giới. Đầu năm nay, VF 8 lần đầu tiên được trưng bày tại triển lãm CES. Với ngôn ngữ thiết kế hiện đại, các tính năng hỗ trợ lái nâng cao cùng các tiện ích thông minh được tích hợp, VF 8 gây ấn tượng mạnh mẽ với giới truyền thông và người dùng quốc tế.

*VinFast VF 8 gây ấn tượng với người tiêu dùng quốc tế tại triển lãm CES 2022 (Nguồn: Sưu tầm)*

**Tháng 2/2022: VF 8 “tham dự” Mobile World Congress 2022 (MWC 2022)**
Mobile World Congress 2022 là triển lãm công nghệ và di động có tầm ảnh hưởng lớn nhất thế giới, diễn ra ngày 28/2 - 3/3/2022 tại Barcelona, Tây Ban Nha. Tại sự kiện, VinFast giới thiệu chi tiết những công nghệ kết nối tiên tiến nhất trên mẫu xe VF 8, các chiến lược cho thị trường Châu Âu cũng như các mối quan hệ hợp tác nhằm thúc đẩy xu hướng di chuyển điện hóa.

*VF 8 được trưng bày tại triển lãm Mobile World Congress 2022 (Nguồn: Sưu tầm)*

**Tháng 4/2022: “Trình làng” và lái thử xe VinFast VF 8 tại triển lãm NYIAS 2022**
VF 8 là tâm điểm chú ý của người tiêu dùng Mỹ tại gian hàng của VinFast trong triển lãm quốc tế New York International Auto Show 2022 tổ chức ngày 10/11/2022, Los Angeles. Tại sự kiện, nhiều khách hàng Mỹ tỏ ra bất ngờ và phấn khích khi được trực tiếp cầm lái mẫu xe điện “made in VietNam” - VinFast VF 8.

*Người dùng Mỹ hào hứng khi lần đầu tiên được trải nghiệm mẫu xe thương hiệu Việt VF 8*

**Tháng 9/2022: VinFast tham gia triển lãm IFA, chính thức giới thiệu VinFast VF 8 tại thị trường Đức**
IFA Berlin là sự kiện công nghệ, công nghiệp lâu đời nhất của nước Đức với hơn 130 quốc gia tham dự. Tại sự kiện, VinFast chính thức ra mắt thị trường Đức mẫu ô tô điện thông minh toàn cầu VF 8 cùng các tính năng, công nghệ nổi bật trên xe. 

*VF 8 được giới thiệu tại thị trường Đức thông qua triển lãm IFA*

**Tháng 11/2022: Triển lãm ô tô Los Angeles Auto Show 2022**
Tại triển lãm Los Angeles Auto Show 2022 ngày 17/11/2022 (tức 18/11 giờ Việt Nam), VF 8 tiếp tục “gặp lại” người tiêu dùng Mỹ. Tại sự kiện, nhiều khách hàng Mỹ đánh giá cao về sự hoàn thiện cao của VF 8 khi tham gia hoạt động trải nghiệm di chuyển thực tế. 

*VinFast VF 8 “trở lại” triển lãm Los Angeles Auto Show 2022 với độ hoàn thiện cao*

Đặc biệt, ngày 25/11/2022, lễ xuất khẩu ô tô điện VinFast VF 8 đã diễn ra long trọng tại Hải Phòng, đánh dấu bước tiến đặc biệt của ngành công nghiệp xe hơi Việt Nam. Lần đầu tiên, sản phẩm ô tô điện của Việt Nam, do người Việt chính thức sản xuất vươn tầm quốc tế, ghi danh lên bản đồ ô tô Toàn cầu. 

*Những chiếc ô tô điện VF 8 lăn bánh lên tàu để bàn giao tới tay khách hàng quốc tế*

VF 8 là khởi đầu thành công trong hành trình vươn ra “biển lớn” của VinFast. Với sự chăm chút từng đường nét thiết kế cho tới tính năng, VF 8 đã mở ra kỷ nguyên mới cho ngành công nghiệp ô tô nước nhà. VF 8 không chỉ là minh chứng cho đẳng cấp và trí tuệ Việt mà còn góp phần nâng tầm vị thế quốc gia trên trường quốc tế.

### 3. VinFast VF 8 - Tương lai toàn cầu hoá

Chỉ sau 28 giờ mở bán, VF 8 đã thu về 15.237 đơn đặt hàng trên Toàn cầu. Con số này cho thấy tín hiệu tích cực trong việc đón nhận của khách hàng quốc tế đối với mẫu xe “xanh” của VinFast. 

Với kích thước lần lượt là 4.750 x 1.934 x 1.667 (mm), thiết kế ngoại thất được chắp bút bởi studio danh tiếng từ Ý Pininfarina, VinFast VF 8 sở hữu vẻ ngoài đậm chất Âu, trong đó có phần táo bạo, tự tin, mang đậm “hơi thở tương lai”.

Tốc độ, công suất vận hành của VF 8 được đánh giá cao về khả năng vận hành, tăng tốc mượt mà, gần như không có độ trễ. Với công suất tối đa 260kW - 300kW, mô-men xoắn cực đại 500 - 620 Nm. Tăng tốc 0-100km/h trong từ 5,9 giây - dưới 5,5 giây giúp VinFast VF 8 không thua kém các dòng xe hạng sang trên thế giới. Đặc biệt, quãng đường di chuyển tối đa sau 1 lần sạc đầy khoảng 420km - 400km giúp người dùng tự tin chinh phục mọi cung đường.

VinFast VF 8 sở hữu nhiều công nghệ thông minh, tính năng hỗ trợ lái nâng cao ADAS như điều khiển xe thông minh, điều hướng - dẫn đường, cảnh báo va chạm, giám sát hành trình thích ứng, hỗ trợ giữ làn khẩn cấp,... giúp người dùng an tâm trên mọi di chuyển.

Với những đặc điểm mang phong cách châu Âu, VinFast VF 8 được đánh giá cao bởi sự kết hợp của thiết kế hiện đại cùng khả năng vận hành khỏe khoắn, tích hợp các tính năng thông minh. Nhờ vậy, VF 8 sẵn sàng lăn bánh trên mọi cung đường Việt và chinh phục mọi hành trình tại Mỹ, Châu Âu.

*Ô tô điện VinFast VF 8 sẵn sàng chinh phục mọi khách hàng trên Toàn cấu*

Dấu ấn VF 8 2022 đã ghi nhận những thành tựu ấn tượng, khẳng định vị thế của mẫu xe ô tô điện thông minh Toàn cầu. Đây sẽ là nền tảng vững chắc để VinFast VF 8 tiếp tục kiến tạo nên những kỷ lục mới, góp phần xây dựng nền văn minh di chuyển “xanh” trên khắp thế giới.

Khách hàng có thể đặt cọc ô tô điện VinFast VF 8 ngay từ hôm nay để được trải nghiệm khả năng vận hành mạnh mẽ, tính năng thông minh, an toàn “vượt phân khúc” và nhận những ưu đãi hấp dẫn từ VinFast.

Để có thêm thông tin hoặc cần hỗ trợ tư vấn về các sản phẩm của VinFast, vui lòng liên hệ với chúng tôi:
      `
    },
    'stations': {
      title: 'Hệ thống trạm sạc thông minh phủ sóng toàn quốc',
      date: '24 Th06, 2026',
      author: 'VinFast News',
      views: '10.2K',
      heroImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvZWBkBQLreNDuqVmR_wuzFG0k2QIM1DOMR-ZMpS5DRezuNNzVUVw9lMkWpgxMBFw2g3GJxHyQ8GeWXV_WayZauS5-108wukYNM6c7kffFYnHKVpfqo5T7rCqfyb6iOHbShCIQinH66eyMQ3Wo9ukU4B8GxEyVh6u8ULoJ0pAaIDdlSNe9zQ4I87ME6DUPxcwEtn41fZWZFYDX9RNEnOjjKwRPhezwGNgtGIy78Dl_Yd5HyfgE59oEfDxs',
      content: `
Với mục tiêu thúc đẩy giao thông xanh, VinFast đang không ngừng mở rộng hệ thống trạm sạc trên toàn quốc. Các trạm sạc được phân bổ rộng khắp từ Bắc vào Nam, mang lại sự tiện lợi tối đa cho khách hàng.

### Phủ sóng mọi tuyến đường

Khách hàng có thể dễ dàng tìm kiếm trạm sạc VinFast thông qua ứng dụng di động. Hiện tại, trạm sạc đã có mặt tại:
- Các tuyến quốc lộ, cao tốc
- Bãi đỗ xe trung tâm thương mại
- Khu chung cư, tòa nhà văn phòng
- Trạm dừng nghỉ dọc đường

VinFast cam kết xây dựng hệ sinh thái giao thông điện toàn diện, giúp người dùng an tâm trên mọi hành trình.
      `
    },
    'app': {
      title: 'Công nghệ điều khiển thông minh qua ứng dụng VinFast',
      date: '23 Th06, 2026',
      author: 'VinFast News',
      views: '8.7K',
      heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3pApHIixibJvbua8jNv134XdqsMGn1bWVL41PCtaMTTiyADwdVHFr4MdVnHt8Gi2Un6h076SLVLzwmTBWm8Xes4PtgEeVBSHy57ummWSa342XRaO5KP_kogAhDXAteIMejIpXAgMCB9UBzDM7gI-TSoXMajTfFwHdH2H4N6qi_XN23x335eZMwBgiBxu2xnVj2C5RD2Ds8HueAz4XwX8XJgO0B1EKnm9kEk64MCw98bgMfuq6KcIh2DbvrXHv_kmTsN6_2m-Qk9o',
      content: `
Ứng dụng VinFast mang đến cho người dùng khả năng điều khiển và quản lý xe một cách toàn diện và tiện lợi.

### Các tính năng nổi bật:
- **Quản lý pin và sạc:** Theo dõi dung lượng pin, tìm kiếm trạm sạc gần nhất và quản lý quá trình sạc.
- **Điều khiển từ xa:** Khóa/mở khóa xe, bật điều hòa, tìm kiếm xe trong bãi đỗ.
- **Dịch vụ thông minh:** Đặt lịch bảo dưỡng, gọi cứu hộ, thanh toán dịch vụ tự động.

Ứng dụng liên tục được cập nhật để mang đến những trải nghiệm tốt nhất cho người dùng xe điện VinFast.
      `
    },
    'viettel_idc_vingroup': {
      title: 'Cộng hưởng sức mạnh: Viettel IDC và Vingroup bắt tay nâng cấp toàn diện hệ sinh thái VinClub',
      date: '26 Th06, 2026',
      author: 'VinClub News',
      views: '5.2K',
      heroImage: viettelIdcImage,
      content: `
Sự kiện bàn giao dự án tích hợp và tối ưu hóa nền tảng kỹ thuật giữa Viettel IDC và Vingroup không chỉ đánh dấu một cột mốc quan trọng trong tiến trình hợp tác song phương, mà còn là minh chứng rõ nét cho xu hướng cộng hưởng sức mạnh giữa các doanh nghiệp dẫn dắt thị trường nhằm thúc đẩy nền kinh tế số.

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

Sự kiện bàn giao dự án lần này là minh chứng rõ nét cho thấy: Sự cộng hưởng sức mạnh giữa các doanh nghiệp dẫn đầu hoàn toàn có thể tạo ra những giá trị mới mang tính đột phá, đóng góp tích cực vào sự phát triển chung của nền kinh tế số nước nhà.
      `
    }
  };

  const { cmsNews, articlesList } = useContext(UserContext);

  let article = newsId && articles[newsId] ? articles[newsId] : null;

  if (!article && newsId) {
    // Check cmsNews
    const foundCms = cmsNews.find((n: any) => n.id === newsId);
    if (foundCms) {
      article = {
        title: foundCms.title,
        date: foundCms.date || 'Hôm nay',
        author: foundCms.author || 'VinClub',
        views: foundCms.views || '1.2K',
        heroImage: foundCms.image || foundCms.imageUrl || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?q=80&w=800',
        content: foundCms.content || ''
      };
    } else {
      // Check articlesList
      const foundArticle = articlesList.find((n: any) => n.id === newsId);
      if (foundArticle) {
        article = {
          title: foundArticle.title,
          date: foundArticle.date || 'Hôm nay',
          author: foundArticle.author || 'Ban Biên Tập',
          views: foundArticle.views || '1.5K',
          heroImage: foundArticle.imageUrl || foundArticle.image || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?q=80&w=800',
          content: foundArticle.content || ''
        };
      }
    }
  }

  if (!article) {
    article = articles['vf8_2022'];
  }

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-1 overflow-y-auto bg-gray-50 flex flex-col w-full max-w-2xl mx-auto h-full scrollbar-hide relative"
      ref={scrollRef}
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-md pt-safe px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-20"
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#c29b57] origin-left"
          style={{ scaleX }}
        />
        <button 
          onClick={onBack}
          className="w-10 h-10 -ml-2 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">Tin tức VinFast</span>
        <button className="w-10 h-10 -mr-2 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </motion.div>

      <div className="flex-1 bg-white relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="w-full h-64 md:h-80 relative overflow-hidden"
        >
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={article.heroImage} 
            alt={article.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 p-5"
          >
            <span className="inline-block bg-[#1B40A6] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm mb-3">
              Tin nổi bật
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {article.title}
            </h1>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="px-5 py-6"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                <img src={vinfastIcon} alt="VinFast" className="w-full h-full object-contain p-1" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{article.author}</p>
                <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.views} lượt xem</span>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:text-[#0c0202] prose-p:text-[#0c0202] text-[#0c0202] prose-p:leading-relaxed prose-a:text-[#1B40A6] prose-img:rounded-xl prose-img:shadow-sm marker:text-[#1B40A6] prose-blockquote:border-l-[#1B40A6] prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:rounded-r-lg pb-10"
          >
            <div className="markdown-body">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

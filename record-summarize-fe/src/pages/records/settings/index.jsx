import { Autocomplete, Box, Breadcrumbs, Button, Chip, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, Step, StepContent, StepLabel, Stepper, TextField, Tooltip, Typography } from '@mui/material';
import styles from './styles.module.scss';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from '@mui/material/Link';
import { AppRoute, PipelineItemTypeEnum, RecordContentTypes, SourceTypeEnum, SourceTypes, VideoLanguages } from '@/constants/app.constants';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useLoading } from '@/contexts/LoadingContextProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { updateRecordById, getRecordById } from '@/repositories/record.repository';
import { getLastestVersionByRecord, getSummaryVersionById } from '@/repositories/summary-version.repository';
import { PipelineSteps, StatusMapStrings } from './page.config';
import { useFormik } from 'formik';
import { BootstrapInput } from '@/components/fields/BootstrapField';
import { BootstrapAutocomplete } from '@/components/fields/BootstrapAutocomplete';
import { getYoutubeEmbedUrl } from '@/utils/youtube';
import readS3Object from '@/utils/avatar/readS3Object';
import ReactPlayer from 'react-player'
import * as Yup from "yup";
import { useSnackbar } from 'notistack';
import { uploadFile } from '@/repositories/storage.repository';
import _ from 'lodash';
import { colors } from '@/theme/theme.global';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import HomeIcon from '@mui/icons-material/Home';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import Scrollbars from 'react-custom-scrollbars-2';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import LoadingButton from '@/components/buttons/LoadingButton';
import IcMsWord from '@/assets/icons/IcMsWord';
import IcExcel from '@/assets/icons/IcExcel';
import IcPdf from '@/assets/icons/IcPdf';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { usePreviewSVDialog } from '@/contexts/PreviewSummaryVContext';


const RecordSettingPage = () => {
  const playerRef = useRef();
  const navigate = useNavigate();
  const { openPreviewDialog } = usePreviewSVDialog();
  const { recordId } = useParams();
  const [record, setRecord] = useState(null);
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [updating, setUpdating] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [videoUploading, setVideoUploading] = useState(false);
  const [youtubeChecking, setYoutubeChecking] = useState(false);
  const [lastVersion, setLastVersion] = useState(null);
  const validationSchema = Yup.object({
    title: Yup
      .string()
      .required("Tiêu đề là bắt buộc"),
    record_content_type: Yup
      .string()
      .required("Thể loại là bắt buộc"),
    url: Yup
      .string()
      .required("Video là bắt buộc"),
    lang: Yup
      .string()
      .required("Ngôn ngữ là bắt buộc"),
    youtubeLink: Yup.string()
      .when("record_content_type", {
        is: (val) => val === SourceTypeEnum.YOUTUBE,
        then: (schema) =>
          schema
            .nullable()
            .required("Youtube link là bắt buộc")
            .matches(
              /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[&?]\S*)?$/,
              "Vui lòng nhập đường dẫn Youtube hợp lệ"
            ),
        otherwise
          : (schema) => schema.nullable().notRequired(),
      }),
  });

  const { touched, errors, values, setValues, setFieldValue, setFieldError, getFieldProps, handleSubmit, validateForm } = useFormik({
    validationSchema: validationSchema,
    enableReinitialize: true,
    initialValues: {
      id: null,
      title: '',
      description: '',
      record_content_type: null,
      url: null,
      youtubeLink: null,
      attachments: [],
      emails: [],
      lang: null,
      source_type: null,
      thumnail_url: null,
    },
    onSubmit: (values, { resetForm, setFieldError }) => {
      const { id, youtubeLink, ...data } = values
      const payload = {
        ...data,
        url: data.source_type === SourceTypeEnum.LOCAL ? data.url : youtubeLink,
        thumnail_url: data.source_type === SourceTypeEnum.LOCAL ? data.thumnail_url : null,
      }
      setUpdating(true);
      updateRecordById(id, payload)
        .then((response) => {
          setRecord(response);
          setUpdating(false);
          enqueueSnackbar('Cập nhật tóm tắt thành công', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        })
        .catch((error) => {

        })
        .finally(() => {

        });
    }
  });

  const handleUploadVideo = (e, setFieldValue, setFieldError) => {
    if (_.isEmpty(e.target.files) || !e.target.files[0]) return;
    setVideoUploading(true);
    uploadFile(e.target.files[0])
      .then(({ data }) => {
        setFieldValue('url', data.url);
        console.log(data);
      })
      .catch((error) => {
        setFieldValue('url', '');
        console.log(error);
      })
      .finally(() => setVideoUploading(false));
  }

  const handleCheckYoutube = (link) => {
    if (_.isEmpty(link)) return Promise.resolve(false);
    setYoutubeChecking(true);
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(link)}&format=json`);
          if (res.ok) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (e) {
          resolve(false);
        } finally {
          setYoutubeChecking(false);
        }
      }, 2500);
    });
  };

  const checkDiff = (original, current) => {
    const keysToCompare = [
      "title",
      "description",
      "record_content_type",
      "url",
      "attachments",
      "emails",
      "lang",
      "source_type",
      "thumnail_url",
    ];
    const diffs = {};
    keysToCompare.forEach((key) => {
      if (!_.isEqual(original[key], current[key])) {
        diffs[key] = {
          oldValue: original[key],
          newValue: current[key],
        };
      }
    });
    return diffs;
  };

  const hasDiff = (original, current) => !_.isEmpty(checkDiff(original, current));

  const getRecordDetail = async () => {
    try {
      if (!isLoading) showLoading();
      const _record = await getRecordById(recordId);
      const _lastestVersion = await getLastestVersionByRecord(recordId);
      const summary_version = await getSummaryVersionById(_record?.current_version_id);
      _record.summary_version = summary_version;
      _record.current_step = 4;
      _record.pipeline_items = [
        {
          "start_time": "2025-09-28T03:14:15.597880",
          "finished_at": "2025-09-28T03:14:15.597880",
          "type": 0,
          "status": "Success",
          "record_id": "1b44222a-07f5-406a-971f-26a179183138",
          "error_message": null,
          "extra": {}
        },
        {
          "start_time": "2025-09-28T03:14:16.044851",
          "finished_at": "2025-09-28T03:17:19.838112",
          "type": 1,
          "status": "Success",
          "record_id": "1b44222a-07f5-406a-971f-26a179183138",
          "error_message": null,
          "extra": {
            "subtitle_s3_key": "vtts/53ee66ee-7b4c-4919-a772-97a99ec9e79b.vtt",
            "transcribe_result": {
              "text": "xin chào các bạn chào mừng các bạn đã quay trở lại với kênh nhiu thút của mình có một số bạn nhắn tin hỏi mình bảo mình là chia sẻ cái cách để có thể ghi nhớ được các cái điều khoản của inh cô thơm và cái cách có thể ghi nhớ và hiểu được nó lâu nhất nhanh nhất thì dựa trên cái kinh nghiệm của mình thì mình cũng sẽ chia sẻ một số câi thíp để cho các bạn có thể nhớ lâu hơn inh cô thơm chính là những cái điều kiện giao hàng đến giúp đỡ người mua và người bán vân biệt được những cái trách nhiệm rủi ro ờ về hàng hóa cũng như là cái chi phí trong quá trình vận chuyển bây giờ đã có in cô thơm hai không hai mươi rồi và được áp dụng từ ngày mùng một tháng một han hai không hai mươi trong in cô thơm hai không hai mươi đhể có mười một điều kiện giao hàng bước thứ nhấ nhất là bọn mình sẽ nhớ theo nhóm chữu cái i ép xi đi có nghĩa là điều kiện giao hàng theo tơm i trước sau đó lên tơm ép sau đó lên tơm xi sau đó lên tơm đi bước thứ hai là mình sẽ nhớ theo cái chiều xuất khẩu của hàng lóa có nghĩa là từ sưởng sau đó là xuất khẩu đi nước ngoài tính theo cái chiều xuất khẩu một lô hàn ăng suất bình thường chúng ta sẽ phân chia thành ba giai đoạn vận chuyển và ở đây mình sẽ lấy ví dụ như là doanh nghiệp suất nhập khẩu a có sưởng sản xuất ở hương yên muốn suất một lô hàng đihà lan và đến cảng lốt ét đam ở hà lan vậy thì chúng ta sẽ có ba giai đoạn vận huyển ở đây giai đoạn vận chuyển thứ nhất là giai đoạn vận chuyển nội địa từ khách ta ri a hương hiên cho tới cảng nếu mà ở đây nếu mà đi đường biển xe tới và si pót là càng hải phòng từ hương hiên cho đến cảng hải phòng là giai đoạn vận chuyển thứ nhất giai đoạn vận chuyển thứ hai là từ cảng hải phòng cho đến cảng rốt te đam đó chính là giai đoạn vận chuyển quốc tế là giai đạn đoạn vận chuyển chính của cái lô hàng này giai đoạn vận chuyển thứ ba là từ lốt tet dam cho đến cái sưởng của nhà nhập khẩu đó một lưu hàng sẽ có ba giai đoạn vận chuyển như vậy và bọn mình sẽ phân chia ờ điều kiện giao hàng theo cái giao đoạn vận chuyển này đối với điều kiện éch buộc là cái điều kiện giao hàng đầu tiên và nó sẽ tương ứng với cái điểm lấy hàng đầu tiên là cái phách co ry là cái sưởng của nhà xuất khẩu ích thuộc nó chính là giao hàng tại sưởng nghĩa là người mua hàng sẽ phải đến sưởng của người bán hàng đến lấy hàng đó thì éch thuộc tơm y nó chỉ có một cái điều kiện giao hàng duy nhất là ch tuồn thôi và nó gắn với cái điểm đầu tiên của xuất khẩu là phách to ri của người bán đó là hết theo cái điều kiện giao hàng nhóm tơm y bây giờ chúng ta sẽ chuyển qua điều kiện giao hàng nhóm tơm ép nhóm tơm ép ở đây là chúng ta sẽ bắt đầu đến với giai đoạn vận chuyển đầu tiên là giai đoạn vận chuyển nội địa từ khách tô ri của người bán cho tới cảng hải phòng là giai đoạn vận chuyển thứ nhất giai đoạn vận chuyển thứ nhất ở gồm tất cả các cái điều kiện giao hàng trong nhóm tơm ép ở đây sẽ có ép xi ây ép ây ép và ép âu vi thì các bạn cứ nhớ và đi an nhá cái gia đoạn vận chuyển thứ nhất là toàn bộ tơm ép là giai đoạn vận chuyển thứ nhất bây giờ chúng ta đã hết cái nhóm điều kiện giao hàng tơm ép rồi thì chúng ta sẽ chuyển sang nhóm điều kiện giao hàng tơm xi và nhóm điều kiện giao hàng tâm xi thì chúng ta cũng sẽ chuyển sang giai đoạn vận chuyển thứ hai là giai đoạn vận chuyển quốc tế từ cảng hải phòng sang đến  cảng nước ngoài cảng rớt tet àn thì cái giai đoạn vận chuyển quốc tế toàn bộ các cái điều kiện giao hàng ở tơm xi nó sẽ nằm vào cái giai đoạn vận chuyển thứ hai là giai đoạn vận chuyển quốc tế nó sẽ bao gồm có xi ép o xi ai ép xi pi ti và xi ai pi thì các bạn cứ nhớ như vậy trước đã nhá thì rơ hết vào cái nhóm ờ tơm xi là ở giai đoạn vận chuyển thứ hai giai đoạn vận chuyển quốc tế bây giờ chúng ta đã xong nhóm tơm xi rồi chúng ta sẽ chuyển qua cái nhóm tơm đi nhóm tơm đi ở đây chúng sẽ sẽ nhảy sang cái giai đoạn vận chuyển thứ ba là gai đạ ạn vận chuyển từ cảng rốt tetdam đến kho của người nhập khẩu là tất cả thuộc về nhóm tơm đi bây giờ cứ tất cả những cái gì mà từ  từ ờ póc rốt tedam đến kho của nười nhập khẩu là đều là do và tó nhóm tơm đi hết tơm đi ở đây thì gồm có đi ây phi đi pi gu ù và đi đi phi cái bước thứ tư là mình sẽ nhớ theo chữ cái viết tắt ở đây mình ví dụ như làm khi các bạn đi phỏng vấn thì nhạc tuyến dụng có thể sẽ hỏi các bạn một câu là anh muốn kiểm tra cái kiến thức của em vì in cô thơm thì anh có một cái ví dụ như tế này để xem em có thể áp được theo đúng cái điều kiện gia hàng nào ví dụ anh có một lô hàng sức đi rút tét đa anh sẽ trả cước đến rốt tet dam đến cảng rốt tet dam và anh muốn mua à bảo hiểm cho cái hàng hóa của anh anh sẽ chỉ trả cước đế rốt tet dam thôi còn phần còn lại à nhập khẩu như thế nào và cái việc vận chuyển từ rốt te dam đến kho của người nhận như thế nào thì là do người nhận do người nhập khẩu họ tự xử lý vậy thì dựa vào câu hỏi này thì mình đã xác định được là nếu mà trả cước đến lốt tét đam có nghĩa là cước vận chuyển quốc tế thì nó đã nằm ở giai đoạn hai mà nằm ở giai đoạn hai thì chắc chắn v phải là tơm xi rồi và anh ấy còn nói thêm là anh ấy sẽ mua bảo hiểm mua bảo hiểm chính là i su rừn theo trựu tiếng anh và trự y là chữ cái đầu tiên chữ cái đầu tiê iân vậy trong các nhóm trong cái nhóm của tom si trong cái nhóm cũ điều kiện giao hàng tom xi thì mình sẽ có hai điều kiện giao hàng có chữ i đó chính là si ai ét và si ai phi si ei ép ở đây có nghĩa là cót i su rừn en prét và cái si ai pi ở đây là cốt  su rừn en phây thu vậy thì cái ờ cái đúng để có thể áp lực trou lô này chính là si ai ép bởi vì cái này nó chỉ có tính cái tiền vận chuyển hàng hóa quốc tế từ hải phòng đến rốt te am và cái i su rừn thôi còn cái si ai pi nó không đúng là bởi vì ờ cái si ai pi pi ở đây là phây thu mà à anh này anh ấy chỉ bảo là anh ấy chỉ pây đến rút tet đam thôi chứ anh ấy không trả tiền thêm một cái đoạn ờ vận chuyển nội địa nào nữa thế nên là mình sẽ không tính vào cái xi ai pi ở đây và thực tế là trong vận chuyển đương biển thì mình sẽ chỉ dùng hai loại điều kiện ở nhóm tâm xi đó là xi ai ép và xi ép a thôi nhá bây giờ ví dụ như là nhàc tiến dụng nói là anh muốn giao hàng vào tận kho của nhà nhập khẩu cơ thế có nghĩa làm cái hàng hóa đấy sẽ đi tiếp từ rốt tet dam vào trong kho của nhà nhập khẩu và anh ý nói rằng là ờ anh sẽ không chi trả và anh sẽ không làm thủ tục nhập khẩu ở bêên a đồng nước ngoài mà anh chỉ giao hàng đến đó và chi trả toàn bộ những cái chi phí phát sinh ở ở rốt tet am thôi nhưng không làm thủ tục hải quan và không chi trả những cái chi phí liên quan đến thuế nhập khẩu và anh cũng không có trách nhiệm phải rỡ hàng xuống cho nhà nhập khẩu hàng hóa được gao vào tận kho của nhà nhập khẩu có nghĩa là từ càng lốt tedam dao vào tận kho nó sẽ nằm ở giai đoạn vận chuyển số ba nằm ở giai đoạn vận chuyển số ba thì ta có những cái điều kiện giao hàng thuộc nhóm tơm đi thuộc nhóm tơm đi và anh ấy nói là anh ấy không làm thủ tục hải quan nhập khẩu và không chi trả bất kỳ những cái chi phí nào liên quan đến làm thủ tục hải quan như là thuế nhập khẩu ờ thì ở đây chúng ta sẽ không tính đến cái phần làm thủ tục hải quan mà trong cái nhóm tơm đi thì chúng ta sẽ có hai cái loại điều kiện giao hàng tương ứng để có thể đúng cho cái lô hàng này đó là đi ây phi và đi phi ưu có nghĩa là đi ri bơ ri ất thuây và đi li bơ ri ất thuây ân b loát nhưng mà anh ấy có nói thêm là anh sẽ không rỡ hàng từ trên xe công tey nơ xuống cho nhà nhập khẩu vậy thì ở đây thì ta sẽ chỉ có một điều kiện giao hàng duy nhất đáp ứng đủ cá yêu cầu của anh ì đó là bi e phi có nghĩa là di ri vơ r ất thây là chỉ giao hàng đến cái điểm đó thôi còn cái bip phi ưu có nghĩa là di ri vơ ri ất hây ân loát có nghĩa là lại còn thêm cả cái phần rỡ hàng xúng cho nhà nhập khẩu nữa nó chỉ khác nhau ở cái việc dỡ hàng xuống và không dỡ hàng xuống thôi mình có thêm một cái cách nữa để mà mình nhớ về những cái điều kiện giao hàng này đó là mình đóng mình là người xuất khẩu có nghĩa là mình sẽ đặt mình vào vị trí của người xuất khẩu đề mình có thể thấy được những cái rủi ro và những cái ì mà có thể đụng trạm đến lợi ích của cái ví tiền của doanh nghiệp là của mình bây giờ mình lấy ví dụ mình có một công ty may che đam và mình muốn xuất khẩu mặt hàng đó đi mỹ bây giờ khách hàng của mình nói với mình rằng là anh muốn mua cái lâu hàng này theo cái điều kiện giao hàng là xi ai ép xi xi ở đây có nghĩa là nó rơi vào cái giai đoạn vận chuyển số hai là giai đoạn vận chuyển quốc tế có nghĩa là mình sẽ phải à trả cái tiền cước vận chuyển quốc tế từ hải phòng sang đến tận mỹ cò nó có thể là cảng niuróp hoặc là bất kỳ cảng nào ở mỹ sang đến cảng ở bên mỹ lại còn si ai ép ai ở đây lại có là có chữu ai là i su rừn nghĩa là mình lại phải mua thêm bảo hiểm cho hàng hóa á nữa khi mà anh ấy nói là anh ấy muốn mua theo cái điều kiện giao hàng  xi e ét và mình đã phải nghĩ luôn là mình sẽ phải trả những cái chi phí gì để có thể vận chuyển được hàng hóa sang bên đó là chi phí vận chuyển quốc tế này chi phí chắc kinh kể cả giai đoạn một làm bởi vì hàng hóa mà đã mình đã phải trả tiền sang đến tận mỹ rồi thì nghiễm nhiên là mình phải trả tiền chắc kinh trả tiền là vận chuyển ở giai đoạn một là từ kho nhà mình đến cả hải phòng rồi xong lại còn tự phải làm thông quan hàng suất xong lại còn phải mua bảo hiểm nữa vậy là mình đã có thể hình dung là tất cả những cái chi phí mà doanh nghiệp của mình công ty của mình phải chi trả ra để mình có thể xuất được hàng cho anh ý theo đúng cái điều kiện mà anh ýy mong muốn vậy thì mình sẽ có thể dựa vào đấy để mình tăng cái giá bán ca mình lên để mình bán đi nếu mình không cộng vào là mình bán lỗ rồi thì nó sẽ ảnh hưởng trực tiếp vào cái túi tiền của mình thế nên là khi các bạn đặt mình vào vị trí của một nhà xuất khẩu thì các bạn sẽ thấy rằng là nó sẽ tác động trực tiếp vào cái rủi ro của hàng hóa của các bạn và cái ví tiền của các bạn tác động trực tiếp vào cái lợi ích của các boạn thì các bạn sẽ nhớ lâu hơn của vi đi ô thì mình muốn tóm tác như thế này các đoạn cứ nhớ là một lô hàng sẽ có ba giai đoạn vận chuyển giai đoạn thứ nhất là thuộc nhóm tơm gì giai đoạn thứ hai tơm gì giai đoạn thứ ba tơm gì iai đoạn thứ nhất là giai đoạn vận chuyển nội địa là tơm ép giai đoạn thứ hai giai đoạn vận chuyển quốc tế là tơm xi giai đoạn thứ ba là giai đoạn vận chuyển nội đi ở đầu nước ngoài là tơm đi có cái tơm y là éch huặc là nó lấy hàng tại sưởng rồi nó không liên quan gì đến ba cái giai đoạn vận chuyển kia và nó rất dễ để nhớ thực tế là học vệ inh côu thơ này nó cũng rất là khó để phân biệt đặc biệt là những bạn nào mà chưa đi làm bao giờ mà bây giờ chỉ học trên lý thuyết thôi thì nó thực sự là một cái rất l à khó khăn tại vì mình đi làm rồi thì nên là mình bắt buộc là mình phải hiểu thì mình mới có thể cung cấp được kỹ dịch vụ phù hợp sang cho khách hàng và để quay được cái vi đô này thực tế là mình mất nguyên một buổi sáng mình nói rất nhiều nhưng mà cuối cùng thì mình lại là cái vi đô khác bởi vì mình tập trung vào cái việc là làm sao để các bạn có thể ghi  nhớ được cả buổi sáng nay mình làm là mình nói toàn bộ những cái ý nghĩa của nó là gì rồi khái niệm của nó ra sao nhưng cái đấy thì các bạn hoàn tàn có thể xết ở trên mạng và sau khi mình làm xang mình xem lại mìn bảo ô chờ ơi mình nói như thế này thì các bạn lên trên mạng các bạn sốt cũng ra chưa cần gì mình phải nói và mình thực sự là để làm được cái vi đô này mình cũng toát mố mối là mình nghĩ mãi mình không biết giải thích cách nào cho các bạn  hiểu các c bạn dễ hiểu luôn ý thì đó là những cái cách mà mình cũng rất là cố gắng để có thể giải thích mà mình cũng hy vọng là các bạn có thể hiểu nhưng các bạn không hiểu các bạn có thể cam nen đở bên giới để mình giải thích thêm mình thực sự rất là nỗ lực cho cái vi đô này và mình rất là hy vọng các bạn có thêm một cái cách để các bạn nhớvề cái điều kiện giao hàng nếu các bạn không hiểu ở đâu thì các bạn có thể khăm dẩn ở bên dưới tì mình sẽ cố gắng để trả lời các bạn và à bây giờ thì rất cảm ơn các bạn đã xem vi đô của mình và hẹn gặp lại các bạn ở cái vi đô tiếp theo i",
              "output_path": "vtts/record-RecordLang.VIE-1b44222a-07f5-406a-971f-26a179183138.vtt"
            },
            "extract_audio_result": {
              "sampling_rate": 16000,
              "output": "wavs/record-1b44222a-07f5-406a-971f-26a179183138.wav"
            }
          }
        },
        {
          "start_time": "2025-09-28T03:17:19.955071",
          "finished_at": "2025-09-28T03:17:28.146505",
          "type": 2,
          "status": "Success",
          "record_id": "1b44222a-07f5-406a-971f-26a179183138",
          "error_message": null,
          "extra": {
            "system_prompt": "\n       Bạn là một trợ lý thông minh. Tôi sẽ cung cấp cho bạn các đoạn thông tin (chunks) được trích xuất từ:\n       1. Video bài giảng (transcript, phụ đề)\n       2. Tài liệu PDF liên quan (slide, handout, sách tham khảo)\n\n       Nội dung transcript:\n       WEBVTT\n\n1\n0:00:00.220 --> 0:00:01.241\nxin chào các bạn chào mừng các bạn\n\n2\n0:00:01.301 --> 0:00:02.362\nđã quay trở lại với kênh nhiu thút\n\n3\n0:00:02.442 --> 0:00:04.324\ncủa mình có một số bạn nhắn tin\n\n4\n0:00:04.504 --> 0:00:06.506\nhỏi mình bảo mình là chia sẻ cái\n\n5\n0:00:06.566 --> 0:00:07.927\ncách để có thể ghi nhớ được các\n\n6\n0:00:08.027 --> 0:00:10.009\ncái điều khoản của inh cô thơm và\n\n7\n0:00:10.110 --> 0:00:11.451\ncái cách có thể ghi nhớ và hiểu\n\n8\n0:00:11.531 --> 0:00:14.114\nđược nó lâu nhất nhanh nhất thì dựa\n\n9\n0:00:14.194 --> 0:00:15.575\ntrên cái kinh nghiệm của mình thì mình\n\n10\n0:00:15.655 --> 0:00:16.916\ncũng sẽ chia sẻ một số câi thíp\n\n11\n0:00:17.137 --> 0:00:18.998\nđể cho các bạn có thể nhớ lâu\n\n12\n0:00:19.099 --> 0:00:21.741\nhơn inhcô thơm chính là những cái điều\n\n13\n0:00:21.821 --> 0:00:23.463\nkiện giao hàng đến giúp đỡ người mua\n\n14\n0:00:23.543 --> 0:00:25.705\nvà người bán vân biệt được những cái\n\n15\n0:00:25.845 --> 0:00:28.968\ntrách nhiệm rủi ro ờ về hàng hóa\n\n16\n0:00:29.149 --> 0:00:30.270\ncũng như là cái chi phí trong quá\n\n17\n0:00:30.350 --> 0:00:31.731\ntrình vận chuyển bây giờ đã có in\n\n18\n0:00:31.791 --> 0:00:33.373\ncô thơm hai không hai mươi rồi và\n\n19\n0:00:33.453 --> 0:00:34.614\nđược áp dụng từ ngày mùng một tháng\n\n20\n0:00:34.714 --> 0:00:36.456\nmột han hai không hai mươi trong in\n\n21\n0:00:36.536 --> 0:00:38.077\ncô thơm hai không hai mươi đhể có\n\n22\n0:00:38.178 --> 0:00:39.879\nmười một điều kiện giao hàng bước thứ\n\n23\n0:00:39.939 --> 0:00:41.281\nnhấnhất là bọn mình sẽ nhớ theo nhóm\n\n24\n0:00:41.421 --> 0:00:43.963\nchữu cái i ép xi đi có nghĩa\n\n25\n0:00:44.043 --> 0:00:45.305\nlà điều kiện giao hàng theo tơm i\n\n26\n0:00:45.485 --> 0:00:47.767\ntrước sau đó lên tơm ép sau đó\n\n27\n0:00:47.827 --> 0:00:49.809\nlên tơm xi sau đó lên tơm đi\n\n28\n0:00:50.310 --> 0:00:51.691\nbước thứ hai là mình sẽ nhớ theo\n\n29\n0:00:51.771 --> 0:00:54.274\ncái chiều xuất khẩu của hàng lóa có\n\n30\n0:00:54.334 --> 0:00:55.975\nnghĩa là từ sưởng sau đó là xuất\n\n31\n0:00:56.075 --> 0:00:58.338\nkhẩu đi nước ngoài tính theo cái chiều\n\n32\n0:00:58.438 --> 0:01:00.760\nxuất khẩu một lô hànăng suất bình thường\n\n33\n0:01:00.820 --> 0:01:02.121\nchúng ta sẽ phân chia thành ba giai\n\n34\n0:01:02.181 --> 0:01:04.123\nđoạn vận chuyển và ở đây mình sẽ\n\n35\n0:01:04.203 --> 0:01:06.225\nlấy ví dụ như là doanh nghiệp suất\n\n36\n0:01:06.286 --> 0:01:08.488\nnhập khẩu a có sưởng sản xuất ở\n\n37\n0:01:08.568 --> 0:01:11.190\nhương yên muốn suất một lô hàng đihà\n\n38\n0:01:11.291 --> 0:01:13.152\nlan và đến cảng lốt ét đam ở\n\n39\n0:01:13.232 --> 0:01:14.834\nhà lan vậy thì chúng ta sẽ có\n\n40\n0:01:14.914 --> 0:01:16.636\nba giai đoạn vận huyển ở đây giai\n\n41\n0:01:16.676 --> 0:01:17.817\nđoạn vận chuyển thứ nhất là giai đoạn\n\n42\n0:01:17.917 --> 0:01:19.919\nvận chuyển nội địa từ khách ta ri\n\n43\n0:01:19.979 --> 0:01:22.902\na hương hiên cho tới cảng nếu mà\n\n44\n0:01:23.383 --> 0:01:24.384\nở đây nếu mà đi đường biển xe\n\n45\n0:01:24.564 --> 0:01:26.426\ntới và si pót là càng hải phòng\n\n46\n0:01:27.106 --> 0:01:28.388\ntừ hương hiên cho đến cảng hải phòng\n\n47\n0:01:28.588 --> 0:01:30.229\nlà giai đoạn vận chuyển thứ nhất giai\n\n48\n0:01:30.289 --> 0:01:31.791\nđoạn vận chuyển thứ hai là từ cảng\n\n49\n0:01:31.851 --> 0:01:34.434\nhải phòng cho đến cảng rốt te đam\n\n50\n0:01:35.134 --> 0:01:36.396\nđó chính là giai đoạn vận chuyển quốc\n\n51\n0:01:36.496 --> 0:01:38.337\ntế là giai đạn đoạn vận chuyển chính\n\n52\n0:01:38.678 --> 0:01:41.060\ncủa cái lô hàng nàygiai đoạn vận chuyển\n\n53\n0:01:41.120 --> 0:01:43.342\nthứ ba là từ lốt tet dam cho\n\n54\n0:01:43.523 --> 0:01:46.125\nđến cái sưởng của nhà nhập khẩu đó\n\n55\n0:01:46.345 --> 0:01:47.567\nmột lưu hàng sẽ có ba giai đoạn\n\n56\n0:01:47.647 --> 0:01:49.188\nvận chuyển như vậy và bọn mình sẽ\n\n57\n0:01:49.288 --> 0:01:51.851\nphân chia ờ điều kiện giao hàng theo\n\n58\n0:01:51.951 --> 0:01:53.713\ncái giao đoạn vận chuyển này đối với\n\n59\n0:01:53.773 --> 0:01:56.716\nđiều kiện éch buộc là cái điều kiện\n\n60\n0:01:56.816 --> 0:01:58.858\ngiao hàng đầu tiên và nó sẽ tương\n\n61\n0:01:59.018 --> 0:02:01.240\nứng với cái điểmlấy hàng đầu tiên là\n\n62\n0:02:01.300 --> 0:02:04.003\ncái phách co ry là cái sưởng của\n\n63\n0:02:04.163 --> 0:02:05.985\nnhà xuất khẩu ích thuộc nó chính là\n\n64\n0:02:06.205 --> 0:02:07.987\ngiao hàng tại sưởng nghĩa là người mua\n\n65\n0:02:08.047 --> 0:02:09.809\nhàng sẽ phải đến sưởng của người bán\n\n66\n0:02:09.889 --> 0:02:11.871\nhàng đến lấy hàng đó thì éch thuộc\n\n67\n0:02:12.271 --> 0:02:13.633\ntơm y nó chỉ có một cái điều\n\n68\n0:02:13.693 --> 0:02:14.874\nkiện giao hàng duy nhất là ch tuồn\n\n69\n0:02:14.974 --> 0:02:16.516\nthôi và nó gắn với cái điểm đầu\n\n70\n0:02:16.676 --> 0:02:18.357\ntiên của xuất khẩu là phách to ri\n\n71\n0:02:18.477 --> 0:02:20.319\ncủa người bán đó là hếtheo cái điều\n\n72\n0:02:20.379 --> 0:02:22.321\nkiện giao hàng nhóm tơm y bây giờ\n\n73\n0:02:22.401 --> 0:02:24.063\nchúng ta sẽ chuyển qua điều kiện giao\n\n74\n0:02:24.163 --> 0:02:26.165\nhàng nhóm tơm ép nhóm tơm ép ở\n\n75\n0:02:26.245 --> 0:02:28.087\nđây là chúng ta sẽ bắt đầu đến\n\n76\n0:02:28.247 --> 0:02:30.309\nvới giai đoạn vận chuyển đầu tiên là\n\n77\n0:02:30.389 --> 0:02:32.431\ngiai đoạn vận chuyển nội địa từ khách\n\n78\n0:02:32.511 --> 0:02:34.694\ntô ri của người bán cho tới cảng\n\n79\n0:02:34.794 --> 0:02:36.956\nhải phòng là giai đoạn vận chuyển thứ\n\n80\n0:02:37.076 --> 0:02:38.417\nnhất giai đoạn vận chuyển thứ nhất ở\n\n81\n0:02:38.497 --> 0:02:40.499\ngồm tất cả các cáiđiều kiện giao hàng\n\n82\n0:02:40.579 --> 0:02:42.421\ntrong nhóm tơm ép ở đây sẽ có\n\n83\n0:02:42.702 --> 0:02:44.263\nép xi ây ép ây ép và ép\n\n84\n0:02:44.443 --> 0:02:46.125\nâu vi thì các bạn cứ nhớ và\n\n85\n0:02:46.205 --> 0:02:47.506\nđi an nhá cái gia đoạn vận chuyển\n\n86\n0:02:47.566 --> 0:02:49.268\nthứ nhất là toàn bộ tơm ép là\n\n87\n0:02:49.348 --> 0:02:51.090\ngiai đoạn vận chuyển thứ nhất bây giờ\n\n88\n0:02:51.150 --> 0:02:52.631\nchúng ta đã hết cái nhóm điều kiện\n\n89\n0:02:52.692 --> 0:02:54.093\ngiao hàng tơm ép rồi thì chúng ta\n\n90\n0:02:54.153 --> 0:02:55.675\nsẽ chuyển sang nhóm điều kiện giao hàng\n\n91\n0:02:55.755 --> 0:02:57.737\ntơm xi và nhóm điều kiện giao hàng\n\n92\n0:02:57.817 --> 0:02:59.238\ntâm xi thì chúng ta cũng sẽ chuyển\n\n93\n0:02:59.358 --> 0:03:01.480\nsang giai đoạn vậnchuyển thứ hai là giai\n\n94\n0:03:01.540 --> 0:03:03.142\nđoạn vận chuyển quốc tế từ cảng hải\n\n95\n0:03:03.262 --> 0:03:06.806\nphòng sang đến cảng nước ngoài cảng rớt\n\n96\n0:03:06.866 --> 0:03:09.969\ntet àn thì cái giai đoạn vận chuyển\n\n97\n0:03:10.069 --> 0:03:12.471\nquốc tế toàn bộ các cái điều kiện\n\n98\n0:03:12.531 --> 0:03:13.893\ngiao hàng ở tơm xi nó sẽ nằm\n\n99\n0:03:14.053 --> 0:03:15.394\nvào cái giai đoạn vận chuyển thứ hai\n\n100\n0:03:15.574 --> 0:03:17.676\nlà giai đoạn vận chuyển quốc tế nó\n\n101\n0:03:17.777 --> 0:03:19.899\nsẽ bao gồm có xi ép o xi\n\n102\n0:03:20.059 --> 0:03:22.001\nai ép xi pi ti và xi ai\n\n103\n0:03:22.141 --> 0:03:23.542\npi thì các bạn cứ nhớ như vậy\n\n104\n0:03:23.622 --> 0:03:25.264\ntrước đã nhá thì rơ hết vào cái\n\n105\n0:03:25.344 --> 0:03:27.766\nnhóm ờ tơm xi là ở giai đoạn\n\n106\n0:03:27.847 --> 0:03:29.468\nvận chuyển thứ hai giai đoạn vận chuyển\n\n107\n0:03:29.548 --> 0:03:31.510\nquốc tế bây giờ chúng ta đã xong\n\n108\n0:03:31.590 --> 0:03:33.392\nnhóm tơm xi rồi chúng ta sẽ chuyển\n\n109\n0:03:33.592 --> 0:03:36.035\nqua cái nhóm tơm đi nhóm tơm đi\n\n110\n0:03:36.135 --> 0:03:38.397\nở đây chúng sẽ sẽ nhảy sang cái\n\n111\n0:03:38.497 --> 0:03:39.899\ngiai đoạn vận chuyển thứ ba là gai\n\n112\n0:03:39.939 --> 0:03:43.422\nđạn vận chuyển từ cảng rốt tetdam đến\n\n113\n0:03:43.802 --> 0:03:46.025\nkho của người nhập khẩu là tất cả\n\n114\n0:03:46.145 --> 0:03:48.047\nthuộc về nhóm tơm đi bây giờ cứ\n\n115\n0:03:48.147 --> 0:03:50.869\ntất cả những cái gì mà từ từ\n\n116\n0:03:51.590 --> 0:03:53.772\nờ póc rốt tedam đến kho của nười\n\n117\n0:03:53.812 --> 0:03:55.234\nnhập khẩu là đều là do và tó\n\n118\n0:03:55.354 --> 0:03:57.396\nnhóm tơm đi hết tơm đi ở đây\n\n119\n0:03:57.496 --> 0:03:59.698\nthì gồm có đi ây phi đi pi\n\n120\n0:03:59.818 --> 0:04:01.921\nguù và đi đi phi cái bước thứ\n\n121\n0:04:02.061 --> 0:04:03.943\ntư là mình sẽ nhớ theo chữ cái\n\n122\n0:04:04.003 --> 0:04:05.504\nviết tắt ở đây mình ví dụ như\n\n123\n0:04:05.604 --> 0:04:06.925\nlàm khi các bạn đi phỏng vấn thì\n\n124\n0:04:07.006 --> 0:04:08.147\nnhạc tuyến dụng có thể sẽ hỏi các\n\n125\n0:04:08.207 --> 0:04:09.808\nbạn một câu là anh muốn kiểm tra\n\n126\n0:04:09.949 --> 0:04:10.950\ncái kiến thức của em vì in cô\n\n127\n0:04:11.050 --> 0:04:12.851\nthơm thì anh có một cái ví dụ\n\n128\n0:04:12.992 --> 0:04:14.433\nnhư tế này để xem em có thể\n\n129\n0:04:14.613 --> 0:04:15.874\náp được theo đúng cái điều kiện gia\n\n130\n0:04:15.954 --> 0:04:17.856\nhàng nào ví dụ anh có một lô\n\n131\n0:04:17.977 --> 0:04:21.040\nhàng sức đi rút tét đanh sẽ trả\n\n132\n0:04:21.180 --> 0:04:23.322\ncước đến rốt tet dam đến cảng rốt\n\n133\n0:04:23.362 --> 0:04:26.565\ntet dam và anh muốn mua à\n\n134\n0:04:27.746 --> 0:04:29.128\nbảo hiểm cho cái hàng hóa của anh\n\n135\n0:04:29.548 --> 0:04:30.549\nanh sẽ chỉ trả cước đế rốt tet\n\n136\n0:04:30.609 --> 0:04:32.531\ndam thôi còn phần còn lại à nhập\n\n137\n0:04:32.611 --> 0:04:34.573\nkhẩu như thế nào và cái việc vận\n\n138\n0:04:34.713 --> 0:04:35.954\nchuyển từ rốt te dam đến kho của\n\n139\n0:04:35.994 --> 0:04:37.456\nngười nhận như thế nào thì là do\n\n140\n0:04:37.556 --> 0:04:39.378\nngười nhận do người nhập khẩu họ tự\n\n141\n0:04:39.498 --> 0:04:42.101\nxử lývậy thì dựa vào câu hỏi này\n\n142\n0:04:42.281 --> 0:04:44.183\nthì mình đã xác định được là nếu\n\n143\n0:04:44.263 --> 0:04:45.484\nmà trả cước đến lốt tét đam có\n\n144\n0:04:45.564 --> 0:04:47.826\nnghĩa là cước vận chuyển quốc tế thì\n\n145\n0:04:47.906 --> 0:04:49.128\nnó đã nằm ở giai đoạn hai mà\n\n146\n0:04:49.188 --> 0:04:50.369\nnằm ở giai đoạn hai thì chắc chắn\n\n147\n0:04:50.449 --> 0:04:52.211\nv phải là tơm xi rồi và anh\n\n148\n0:04:52.311 --> 0:04:53.332\nấy còn nói thêm là anh ấy sẽ\n\n149\n0:04:53.472 --> 0:04:55.334\nmua bảo hiểm mua bảo hiểm chính là\n\n150\n0:04:55.454 --> 0:04:57.496\ni su rừn theo trựu tiếng anh và\n\n151\n0:04:57.616 --> 0:04:59.478\ntrự y là chữ cái đầu tiên chữ\n\n152\n0:04:59.538 --> 0:05:01.760\ncái đầu tiêiân vậy trong các nhóm trong\n\n153\n0:05:01.840 --> 0:05:04.443\ncái nhóm của tom si trong cái nhóm\n\n154\n0:05:04.563 --> 0:05:05.824\ncũ điều kiện giao hàng tom xi thì\n\n155\n0:05:05.984 --> 0:05:07.266\nmình sẽ có hai điều kiện giao hàng\n\n156\n0:05:07.766 --> 0:05:09.568\ncó chữ i đó chính là si ai\n\n157\n0:05:09.808 --> 0:05:12.491\nét và si ai phi si ei ép\n\n158\n0:05:12.711 --> 0:05:14.473\nở đây có nghĩa là cót i su\n\n159\n0:05:14.533 --> 0:05:16.995\nrừn en prét và cái si ai pi\n\n160\n0:05:17.115 --> 0:05:19.077\nở đây là cốt su rừn en phây\n\n161\n0:05:19.218 --> 0:05:22.481\nthu vậy thì cái ờ cái\n\n162\n0:05:22.581 --> 0:05:23.642\nđúng để có thể áp lực trou lô\n\n163\n0:05:23.742 --> 0:05:25.344\nnày chính là si ai ép bởi vì\n\n164\n0:05:25.444 --> 0:05:28.527\ncái này nó chỉ có tính cái\n\n165\n0:05:29.227 --> 0:05:30.549\ntiền vận chuyển hàng hóa quốc tế từ\n\n166\n0:05:30.629 --> 0:05:32.451\nhải phòng đến rốt te am và cái\n\n167\n0:05:32.571 --> 0:05:34.333\ni su rừn thôi còn cái si ai\n\n168\n0:05:34.433 --> 0:05:36.975\npi nó không đúng là bởi vì ờ\n\n169\n0:05:37.075 --> 0:05:38.837\ncái si ai pi pi ở đây là\n\n170\n0:05:38.937 --> 0:05:41.740\nphây thu mà anh này anh ấy chỉ\n\n171\n0:05:41.820 --> 0:05:43.822\nbảo là anh ấy chỉ pây đến rút\n\n172\n0:05:43.882 --> 0:05:45.223\ntet đam thôi chứ anh ấy không trả\n\n173\n0:05:45.364 --> 0:05:47.426\ntiền thêm một cái đoạn ờ vận chuyển\n\n174\n0:05:47.466 --> 0:05:49.328\nnội địa nào nữa thế nên là mình\n\n175\n0:05:49.428 --> 0:05:50.909\nsẽ không tính vào cái xi ai pi\n\n176\n0:05:51.049 --> 0:05:52.831\nở đây và thực tế là trong vận\n\n177\n0:05:52.931 --> 0:05:55.173\nchuyển đương biển thì mình sẽ chỉ dùng\n\n178\n0:05:55.293 --> 0:05:56.735\nhai loại điều kiện ở nhóm tâm xi\n\n179\n0:05:56.855 --> 0:05:58.757\nđó là xi ai ép và xi ép\n\n180\n0:05:59.117 --> 0:06:01.159\na thôi nhábây giờ ví dụ như là\n\n181\n0:06:01.239 --> 0:06:02.881\nnhàc tiến dụng nói là anh muốn giao\n\n182\n0:06:02.961 --> 0:06:04.863\nhàng vào tận kho của nhà nhập khẩu\n\n183\n0:06:04.983 --> 0:06:06.785\ncơ thế có nghĩa làm cái hàng hóa\n\n184\n0:06:06.845 --> 0:06:08.507\nđấy sẽ đi tiếp từ rốt tet dam\n\n185\n0:06:08.587 --> 0:06:10.248\nvào trong kho của nhà nhập khẩu và\n\n186\n0:06:10.368 --> 0:06:12.491\nanh ý nói rằng là ờ anh sẽ\n\n187\n0:06:12.611 --> 0:06:14.132\nkhông chi trả và anh sẽ không làm\n\n188\n0:06:14.212 --> 0:06:16.995\nthủ tục nhập khẩu ở bên a đồng\n\n189\n0:06:17.055 --> 0:06:19.337\nnước ngoài mà anh chỉ giao hàng đến\n\n190\n0:06:19.417 --> 0:06:21.660\nđóvà chi trả toàn bộ những cái chi\n\n191\n0:06:21.940 --> 0:06:24.763\nphí phát sinh ở ở rốt tet am\n\n192\n0:06:24.863 --> 0:06:26.424\nthôi nhưng không làm thủ tục hải quan\n\n193\n0:06:27.085 --> 0:06:28.687\nvà không chi trả những cái chi phí\n\n194\n0:06:28.867 --> 0:06:31.149\nliên quan đến thuế nhập khẩu và anh\n\n195\n0:06:31.229 --> 0:06:32.591\ncũng không có trách nhiệm phải rỡ hàng\n\n196\n0:06:32.731 --> 0:06:35.213\nxuống cho nhà nhập khẩu hàng hóa được\n\n197\n0:06:35.273 --> 0:06:36.535\ngao vào tận kho của nhà nhập khẩu\n\n198\n0:06:37.055 --> 0:06:38.416\ncó nghĩa là từ càng lốt tedam dao\n\n199\n0:06:38.476 --> 0:06:40.438\nvào tận kho nó sẽ nằm ở giai\n\n200\n0:06:40.498 --> 0:06:42.240\nđoạn vận chuyển số ba nằm ở giai\n\n201\n0:06:42.300 --> 0:06:43.862\nđoạn vận chuyển số ba thì ta có\n\n202\n0:06:43.962 --> 0:06:45.403\nnhững cái điều kiện giao hàng thuộc nhóm\n\n203\n0:06:45.544 --> 0:06:48.146\ntơm đi thuộc nhóm tơm đi và anh\n\n204\n0:06:48.266 --> 0:06:50.268\nấy nói là anh ấy không làm thủ\n\n205\n0:06:50.348 --> 0:06:52.010\ntục hải quan nhập khẩu và không chi\n\n206\n0:06:52.110 --> 0:06:54.052\ntrả bất kỳ những cái chi phí nào\n\n207\n0:06:54.172 --> 0:06:55.874\nliên quan đến làm thủ tục hải quan\n\n208\n0:06:56.374 --> 0:06:58.957\nnhư là thuế nhập khẩu ờ thì ở\n\n209\n0:06:59.017 --> 0:07:00.498\nđây chúng ta sẽ không tínhđến cái phần\n\n210\n0:07:00.719 --> 0:07:03.521\nlàm thủ tục hải quan mà trong cái\n\n211\n0:07:03.561 --> 0:07:05.283\nnhóm tơm đi thì chúng ta sẽ có\n\n212\n0:07:05.423 --> 0:07:07.385\nhai cái loại điều kiện giao hàng tương\n\n213\n0:07:07.545 --> 0:07:10.889\nứng để có thể đúng cho cái lô\n\n214\n0:07:10.989 --> 0:07:12.951\nhàng này đó là đi ây phi và\n\n215\n0:07:13.131 --> 0:07:15.013\nđi phi ưu có nghĩa là đi ri\n\n216\n0:07:15.133 --> 0:07:16.875\nbơ ri ất thuây và đi li bơ\n\n217\n0:07:16.955 --> 0:07:18.857\nri ất thuây ân b loát nhưng mà\n\n218\n0:07:18.977 --> 0:07:20.719\nanh ấy có nói thêm làanh sẽ không\n\n219\n0:07:20.939 --> 0:07:22.841\nrỡ hàng từ trên xe công tey nơ\n\n220\n0:07:23.041 --> 0:07:26.644\nxuống cho nhà nhập khẩu vậy thì ở\n\n221\n0:07:26.725 --> 0:07:27.886\nđây thì ta sẽ chỉ có một điều\n\n222\n0:07:27.966 --> 0:07:29.527\nkiện giao hàng duy nhất đáp ứng đủ\n\n223\n0:07:29.888 --> 0:07:31.009\ncá yêu cầu của anh ì đó là\n\n224\n0:07:31.109 --> 0:07:32.831\nbi e phi có nghĩa là di ri\n\n225\n0:07:32.931 --> 0:07:34.833\nvơ r ất thây là chỉ giao hàng\n\n226\n0:07:34.893 --> 0:07:36.714\nđến cái điểm đó thôi còn cái bip\n\n227\n0:07:36.855 --> 0:07:38.236\nphi ưu có nghĩa là di ri vơ\n\n228\n0:07:38.316 --> 0:07:40.718\nri ất hây ân loát có nghĩa là\n\n229\n0:07:41.019 --> 0:07:42.460\nlại còn thêm cả cái phần rỡ hàng\n\n230\n0:07:42.600 --> 0:07:44.022\nxúng cho nhà nhập khẩu nữa nó chỉ\n\n231\n0:07:44.102 --> 0:07:45.423\nkhác nhau ở cái việc dỡ hàng xuống\n\n232\n0:07:45.463 --> 0:07:47.806\nvà không dỡ hàng xuống thôi mình có\n\n233\n0:07:47.886 --> 0:07:49.087\nthêm một cái cách nữa để mà mình\n\n234\n0:07:49.227 --> 0:07:50.989\nnhớ về những cái điều kiện giao hàng\n\n235\n0:07:51.089 --> 0:07:53.151\nnày đó là mình đóng mình là người\n\n236\n0:07:53.491 --> 0:07:54.973\nxuất khẩu có nghĩa là mình sẽ đặt\n\n237\n0:07:55.153 --> 0:07:56.394\nmình vào vị trí của người xuất khẩu\n\n238\n0:07:56.494 --> 0:07:58.456\nđề mình có thể thấy được những cái\n\n239\n0:07:58.556 --> 0:08:00.238\nrủi ro và những cái ì mà có\n\n240\n0:08:00.298 --> 0:08:02.600\nthể đụng trạm đến lợi ích của cái\n\n241\n0:08:02.700 --> 0:08:03.962\nví tiền của doanh nghiệp là của mình\n\n242\n0:08:04.322 --> 0:08:06.124\nbây giờ mình lấy ví dụ mình có\n\n243\n0:08:06.224 --> 0:08:07.906\nmột công ty may che đam và mình\n\n244\n0:08:07.966 --> 0:08:09.207\nmuốn xuất khẩu mặt hàng đó đi mỹ\n\n245\n0:08:09.747 --> 0:08:11.029\nbây giờ khách hàng của mình nói với\n\n246\n0:08:11.109 --> 0:08:13.111\nmình rằng là anh muốn mua cái lâu\n\n247\n0:08:13.211 --> 0:08:15.353\nhàng này theo cái điều kiện giao hàng\n\n248\n0:08:15.433 --> 0:08:17.515\nlà xi ai ép xi xi ở đây\n\n249\n0:08:17.956 --> 0:08:19.217\ncó nghĩa là nó rơi vào cái giai\n\n250\n0:08:19.277 --> 0:08:21.039\nđoạn vận chuyển số hai là giai đoạn\n\n251\n0:08:21.119 --> 0:08:22.860\nvận chuyển quốc tế có nghĩa là mình\n\n252\n0:08:23.021 --> 0:08:26.064\nsẽ phải à trả cái tiền cước vận\n\n253\n0:08:26.124 --> 0:08:28.766\nchuyển quốc tế từ hải phòng sang đến\n\n254\n0:08:28.846 --> 0:08:30.228\ntận mỹ cò nó có thể là cảng\n\n255\n0:08:30.308 --> 0:08:31.649\nniuróp hoặc là bất kỳ cảng nào ở\n\n256\n0:08:31.749 --> 0:08:34.732\nmỹ sang đến cảng ở bên mỹ lại\n\n257\n0:08:34.792 --> 0:08:36.174\ncòn si ai ép ai ở đây lại\n\n258\n0:08:36.254 --> 0:08:37.655\ncó là có chữu ai là i su\n\n259\n0:08:37.735 --> 0:08:39.117\nrừn nghĩa là mình lại phải mua thêm\n\n260\n0:08:39.197 --> 0:08:40.958\nbảo hiểm cho hàng hóaá nữa khi mà\n\n261\n0:08:41.039 --> 0:08:42.160\nanh ấy nói là anh ấy muốn mua\n\n262\n0:08:42.240 --> 0:08:43.701\ntheo cái điều kiện giao hàng xi e\n\n263\n0:08:43.861 --> 0:08:45.223\nét và mình đã phải nghĩ luôn là\n\n264\n0:08:45.923 --> 0:08:47.145\nmình sẽ phải trả những cái chi phí\n\n265\n0:08:47.265 --> 0:08:48.946\ngì để có thể vận chuyển được hàng\n\n266\n0:08:49.007 --> 0:08:50.908\nhóa sang bên đó là chi phí vận\n\n267\n0:08:50.968 --> 0:08:52.950\nchuyển quốc tế này chi phí chắc kinh\n\n268\n0:08:53.751 --> 0:08:55.313\nkể cả giai đoạn một làm bởi vì\n\n269\n0:08:55.513 --> 0:08:57.095\nhàng hóa mà đã mình đã phải trả\n\n270\n0:08:57.235 --> 0:08:59.157\ntiền sang đến tận mỹ rồi thì nghiễm\n\n271\n0:08:59.237 --> 0:09:01.579\nnhiên là mình phải trảtiền chắc kinh trả\n\n272\n0:09:01.759 --> 0:09:03.040\ntiền là vận chuyển ở giai đoạn một\n\n273\n0:09:03.141 --> 0:09:04.502\nlà từ kho nhà mình đến cả hải\n\n274\n0:09:04.582 --> 0:09:07.365\nphòng rồi xong lại còn tự phải làm\n\n275\n0:09:07.465 --> 0:09:09.066\nthông quan hàng suất xong lại còn phải\n\n276\n0:09:09.167 --> 0:09:10.788\nmua bảo hiểm nữa vậy là mình đã\n\n277\n0:09:10.868 --> 0:09:12.170\ncó thể hình dung là tất cả những\n\n278\n0:09:12.210 --> 0:09:13.431\ncái chi phí mà doanh nghiệp của mình\n\n279\n0:09:13.591 --> 0:09:15.072\ncông ty của mình phải chi trả ra\n\n280\n0:09:15.193 --> 0:09:16.494\nđể mình có thể xuất được hàng cho\n\n281\n0:09:16.574 --> 0:09:17.675\nanh ý theo đúng cái điều kiện mà\n\n282\n0:09:17.755 --> 0:09:20.358\nanh ýy mong muốn vậy thì mìnhsẽ có\n\n283\n0:09:20.458 --> 0:09:22.059\nthể dựa vào đấy để mình tăng cái\n\n284\n0:09:22.099 --> 0:09:23.301\ngiá bán ca mình lên để mình bán\n\n285\n0:09:23.381 --> 0:09:24.822\nđi nếu mình không cộng vào là mình\n\n286\n0:09:24.882 --> 0:09:26.844\nbán lỗ rồi thì nó sẽ ảnh hưởng\n\n287\n0:09:26.924 --> 0:09:29.367\ntrực tiếp vào cái túi tiền của mình\n\n288\n0:09:29.627 --> 0:09:31.088\nthế nên là khi các bạn đặt mình\n\n289\n0:09:31.148 --> 0:09:32.310\nvào vị trí của một nhà xuất khẩu\n\n290\n0:09:32.370 --> 0:09:33.631\nthì các bạn sẽ thấy rằng là nó\n\n291\n0:09:33.711 --> 0:09:35.313\nsẽ tác động trực tiếp vào cái rủi\n\n292\n0:09:35.393 --> 0:09:36.874\nro của hàng hóa của các bạn và\n\n293\n0:09:36.954 --> 0:09:38.676\ncái ví tiền của các bạn tác động\n\n294\n0:09:38.956 --> 0:09:40.077\ntrực tiếp vào cái lợi ích của cácboạn\n\n295\n0:09:40.177 --> 0:09:42.260\nthì các bạn sẽ nhớ lâu hơn của\n\n296\n0:09:42.340 --> 0:09:43.521\nvi đi ô thì mình muốn tóm tác\n\n297\n0:09:43.581 --> 0:09:45.162\nnhư thế này các đoạn cứ nhớ là\n\n298\n0:09:45.243 --> 0:09:46.404\nmột lô hàng sẽ có ba giai đoạn\n\n299\n0:09:46.484 --> 0:09:48.326\nvận chuyển giai đoạn thứ nhất là thuộc\n\n300\n0:09:48.426 --> 0:09:50.207\nnhóm tơm gì giai đoạn thứ hai tơm\n\n301\n0:09:50.348 --> 0:09:52.169\ngì giai đoạn thứ ba tơm gì iai\n\n302\n0:09:52.229 --> 0:09:53.471\nđoạn thứ nhất là giai đoạn vận chuyển\n\n303\n0:09:53.531 --> 0:09:55.253\nnội địa là tơm ép giai đoạn thứ\n\n304\n0:09:55.373 --> 0:09:56.994\nhai giai đoạn vận chuyển quốc tế là\n\n305\n0:09:57.094 --> 0:09:59.056\ntơm xi giai đoạn thứ ba là giai\n\n306\n0:09:59.136 --> 0:10:00.938\nđoạn vận chuyểnội đi ở đầu nước ngoài\n\n307\n0:10:01.018 --> 0:10:03.100\nlà tơm đi có cái tơm y là\n\n308\n0:10:03.260 --> 0:10:04.862\néch huặc là nó lấy hàng tại sưởng\n\n309\n0:10:04.942 --> 0:10:06.884\nrồi nó không liên quan gì đến ba\n\n310\n0:10:07.044 --> 0:10:09.006\ncái giai đoạn vận chuyển kia và nó\n\n311\n0:10:09.086 --> 0:10:10.908\nrất dễ để nhớ thực tế là học\n\n312\n0:10:10.968 --> 0:10:12.690\nvệ inh côu thơ này nó cũng rất\n\n313\n0:10:12.810 --> 0:10:14.892\nlà khó để phân biệt đặc biệt là\n\n314\n0:10:14.952 --> 0:10:16.233\nnhững bạn nào mà chưa đi làm bao\n\n315\n0:10:16.354 --> 0:10:17.675\ngiờ mà bây giờ chỉ học trên lý\n\n316\n0:10:17.775 --> 0:10:19.597\nthuyết thôi thì nó thực sự là một\n\n317\n0:10:19.677 --> 0:10:21.559\ncái rất là khó khăn tại vì mình\n\n318\n0:10:21.619 --> 0:10:23.501\nđi làm rồi thì nên là mình bắt\n\n319\n0:10:23.601 --> 0:10:25.242\nbuộc là mình phải hiểu thì mình mới\n\n320\n0:10:25.362 --> 0:10:26.524\ncó thể cung cấp được kỹ dịch vụ\n\n321\n0:10:26.604 --> 0:10:29.627\nphù hợp sang cho khách hàng và để\n\n322\n0:10:29.747 --> 0:10:30.968\nquay được cái vi đô này thực tế\n\n323\n0:10:31.028 --> 0:10:32.389\nlà mình mất nguyên một buổi sáng mình\n\n324\n0:10:32.470 --> 0:10:35.112\nnói rất nhiều nhưng mà cuối cùng thì\n\n325\n0:10:35.212 --> 0:10:37.074\nmình lại là cái vi đô khác bởi\n\n326\n0:10:37.174 --> 0:10:39.957\nvì mình tập trung vào cái việc là\n\n327\n0:10:40.117 --> 0:10:41.198\nlàm sao để các bạn có thể ghi\n\n328\n0:10:41.318 --> 0:10:43.741\nnhớ được cả buổi sáng nay mình làm\n\n329\n0:10:43.821 --> 0:10:45.342\nlà mình nói toàn bộ những cái ý\n\n330\n0:10:45.443 --> 0:10:47.044\nnghĩa của nó là gì rồi khái niệm\n\n331\n0:10:47.104 --> 0:10:48.385\ncủa nó ra sao nhưng cái đấy thì\n\n332\n0:10:48.445 --> 0:10:49.446\ncác bạn hoàn tàn có thể xết ở\n\n333\n0:10:49.507 --> 0:10:51.288\ntrên mạng và sau khi mình làm xang\n\n334\n0:10:51.348 --> 0:10:52.790\nmình xem lại mìn bảo ô chờ ơi\n\n335\n0:10:52.850 --> 0:10:54.011\nmình nói như thế này thì các bạn\n\n336\n0:10:54.131 --> 0:10:55.312\nlên trên mạng các bạn sốt cũng ra\n\n337\n0:10:55.452 --> 0:10:57.995\nchưa cần gì mình phải nói và mình\n\n338\n0:10:58.075 --> 0:10:59.356\nthực sự là để làm được cái vi\n\n339\n0:10:59.416 --> 0:11:00.938\nđô này mìnhcũng toát mố mối là mình\n\n340\n0:11:01.118 --> 0:11:02.900\nnghĩ mãi mình không biết giải thích cách\n\n341\n0:11:03.020 --> 0:11:04.221\nnào cho các bạn hiểu các c bạn\n\n342\n0:11:04.381 --> 0:11:06.123\ndễ hiểu luôn ý thì đó là những\n\n343\n0:11:06.183 --> 0:11:07.444\ncái cách mà mình cũng rất là cố\n\n344\n0:11:07.585 --> 0:11:09.386\ngắng để có thể giải thích mà mình\n\n345\n0:11:09.787 --> 0:11:10.828\ncũng hy vọng là các bạn có thể\n\n346\n0:11:10.928 --> 0:11:12.409\nhiểu nhưng các bạn không hiểu các bạn\n\n347\n0:11:12.469 --> 0:11:13.470\ncó thể cam nen đở bên giới để\n\n348\n0:11:13.551 --> 0:11:15.893\nmình giải thích thêm mình thực sự rất\n\n349\n0:11:15.933 --> 0:11:17.094\nlà nỗ lực cho cái vi đô này\n\n350\n0:11:17.514 --> 0:11:18.676\nvà mình rất là hy vọng các bạn\n\n351\n0:11:19.236 --> 0:11:21.318\ncó thêm một cái cáchđể các bạn nhớvề\n\n352\n0:11:21.398 --> 0:11:23.040\ncái điều kiện giao hàng nếu các bạn\n\n353\n0:11:23.140 --> 0:11:24.441\nkhông hiểu ở đâu thì các bạn có\n\n354\n0:11:24.501 --> 0:11:25.743\nthể khăm dẩn ở bên dưới tì mình\n\n355\n0:11:25.823 --> 0:11:27.124\nsẽ cố gắng để trả lời các bạn\n\n356\n0:11:27.705 --> 0:11:30.407\nvà à bây giờ thì rất cảm ơn\n\n357\n0:11:30.487 --> 0:11:31.949\ncác bạn đã xem vi đô của mình\n\n358\n0:11:32.089 --> 0:11:33.050\nvà hẹn gặp lại các bạn ở cái\n\n359\n0:11:33.130 --> 0:11:34.331\nvi đô tiếp theo i\n\n       Nội dung tệp đính kèm: \n       \n       \n       \n        Bạn là một trợ lý tóm tắt video hướng dẫn hoặc đào tạo.\n        Nhiệm vụ của bạn: Dựa trên transcript video, tiêu đề, mô tả và tài liệu tham khảo (nếu có), hãy tạo bản tóm tắt theo đúng khung ghi chú dưới đây.\n        Trình bày bằng Markdown, có cấu trúc rõ ràng, ngắn gọn, dễ học, kèm trích dẫn trực tiếp từ transcript với timestamp nếu có.\n        \n        Cấu trúc bắt buộc:\n        \n        ## 1. Thông tin chung\n        - Tiêu đề:  \n        - Người hướng dẫn:  \n        - Ngày phát hành / bối cảnh:  \n        - Mục tiêu đào tạo:  \n        \n        ## 2. Nội dung hướng dẫn\n        ### A. Mở đầu\n        - Vấn đề đặt ra hoặc câu hỏi khởi đầu  \n        - Mục tiêu hoặc kết quả cần đạt được sau khóa học  \n        - *Trích dẫn tiêu biểu*: “...” [timestamp]  \n        \n        ### B. Các bước / Quy trình\n        - Liệt kê các bước hoặc quy trình trong bài học  \n        - Các công cụ, kỹ thuật hoặc chiến lược được sử dụng  \n        - *Trích dẫn*: “...”  \n        \n        ### C. Mẹo và chiến lược\n        - Các mẹo hoặc chiến lược cần nhớ khi thực hành  \n        - *Trích dẫn*: “...”  \n        \n        ### D. Ví dụ thực tế\n        - Ví dụ minh họa thực tế cho từng bước hoặc quy trình  \n        - Ý nghĩa và ứng dụng của ví dụ đó  \n        - *Trích dẫn*: “...”  \n        \n        ### E. Thảo luận & Câu hỏi mở\n        - Các câu hỏi hoặc thảo luận để người học có thể tự suy nghĩ và mở rộng kiến thức  \n        - *Trích dẫn*: “...”  \n        \n        ## 3. Tổng hợp\n        - Ba ý chính cần nhớ:  \n          1. …  \n          2. …  \n          3. …  \n        - Lời khuyên và chiến lược từ người hướng dẫn  \n        - *Trích dẫn lời nhấn mạnh*: “...”  \n        \n        ## 4. Tài liệu liên quan\n        - Slide, tài liệu tham khảo, link (nếu có)\n        \n        Yêu cầu:\n        - Trình bày mạch lạc, ngắn gọn, không thêm ý ngoài transcript hoặc tài liệu cung cấp.\n        - Luôn giữ format Markdown.\n        Format text để xuống dòng\n    \n       ",
            "summary": "Tuyệt vời! Dưới đây là bản tóm tắt video bài giảng về cách ghi nhớ Incoterms, được trình bày theo cấu trúc Markdown bạn yêu cầu:\n\n## 1. Thông tin chung\n\n-   **Tiêu đề:** Cách ghi nhớ điều khoản Incoterms\n-   **Người hướng dẫn:** Nhiu Thút\n-   **Ngày phát hành / bối cảnh:** Không rõ, nhưng video đề cập đến Incoterms 2020.\n-   **Mục tiêu đào tạo:** Chia sẻ các tips để ghi nhớ và hiểu rõ các điều khoản Incoterms một cách nhanh chóng và lâu dài.\n\n## 2. Nội dung hướng dẫn\n\n### A. Mở đầu\n\n-   **Vấn đề đặt ra hoặc câu hỏi khởi đầu:** Nhiều người nhắn tin hỏi về cách ghi nhớ các điều khoản Incoterms.\n-   **Mục tiêu hoặc kết quả cần đạt được sau khóa học:** Giúp người xem phân biệt được trách nhiệm, rủi ro và chi phí trong quá trình vận chuyển hàng hóa theo các điều kiện Incoterms.\n-   ***Trích dẫn tiêu biểu***: \" *xin chào các bạn chào mừng các bạn đã quay trở lại với kênh nhiu thút của mình có một số bạn nhắn tin hỏi mình bảo mình là chia sẻ cái cách để có thể ghi nhớ được các cái điều khoản của inh cô thơm và cái cách có thể ghi nhớ và hiểu được nó lâu nhất nhanh nhất*\" \\[0:00:00-0:00:11]\n\n### B. Các bước / Quy trình\n\n1.  **Nhớ theo nhóm:** E, F, C, D. \"*bước thứ nhất nhất là bọn mình sẽ nhớ theo nhóm chữ cái i ép xi đi*\" \\[0:00:23]\n2.  **Nhớ theo chiều xuất khẩu:** Từ xưởng sản xuất đến cảng xuất, vận chuyển quốc tế, và đến kho người nhập khẩu.\n3.  **Phân chia theo giai đoạn vận chuyển:** Chia quá trình vận chuyển thành 3 giai đoạn:\n    *   Nội địa (từ xưởng đến cảng xuất).\n    *   Quốc tế (từ cảng xuất đến cảng nhập).\n    *   Nội địa ở nước ngoài (từ cảng nhập đến kho người nhập khẩu).\n4.  **Liên hệ với các điều kiện Incoterms:**\n    *   **Nhóm E (EXW):** Giao hàng tại xưởng.\n    *   **Nhóm F (FCA, FAS, FOB):** Giai đoạn vận chuyển nội địa.\n    *   **Nhóm C (CFR, CIF, CPT, CIP):** Giai đoạn vận chuyển quốc tế.\n    *   **Nhóm D (DAP, DPU, DDP):** Giai đoạn vận chuyển nội địa ở nước ngoài.\n5.  **Nhớ theo chữ cái viết tắt:** Liên hệ chữ cái đầu của điều kiện với ý nghĩa của nó (ví dụ: CIF có \"I\" là Insurance - Bảo hiểm).\n\n### C. Mẹo và chiến lược\n\n-   **Đặt mình vào vị trí người xuất khẩu:** Để hiểu rõ rủi ro và chi phí liên quan đến từng điều kiện Incoterms. \"*đó là mình đóng mình là người xuất khẩu có nghĩa là mình sẽ đặt mình vào vị trí của người xuất khẩu đề mình có thể thấy được những cái rủi ro và những cái ì mà có thể đụng trạm đến lợi ích của cái ví tiền của doanh nghiệp là của mình*\" \\[07:51-08:04]\n\n### D. Ví dụ thực tế\n\n1.  **Ví dụ 1: CIF**\n    *   Khách hàng muốn trả cước và mua bảo hiểm đến cảng đích.\n    *   Điều kiện phù hợp: CIF (Cost, Insurance, and Freight).\n2.  **Ví dụ 2: DPU/DAP**\n    *   Giao hàng đến tận kho người nhập khẩu, nhưng người bán không làm thủ tục nhập khẩu.\n    *   Nếu người bán không dỡ hàng: DAP (Delivered at Place).\n    *   Nếu người bán dỡ hàng: DPU (Delivered at Place Unloaded). \"*nếu các bạn không hiểu các bạn có thể cam nen đở bên giới để mình giải thích thêm mình thực sự rất là nỗ lực cho cái vi đô này*\" \\[11:11-11:17]\n\n### E. Thảo luận & Câu hỏi mở\n\n-   Tại sao việc hiểu rõ Incoterms lại quan trọng đối với doanh nghiệp xuất nhập khẩu?\n-   Điều gì sẽ xảy ra nếu chọn sai điều kiện Incoterms cho một lô hàng?\n\n## 3. Tổng hợp\n\n-   **Ba ý chính cần nhớ:**\n    1.  **Nhớ theo nhóm chữ cái:** E, F, C, D.\n    2.  **Phân chia theo giai đoạn vận chuyển:** Nội địa, quốc tế, nội địa (nước ngoài).\n    3.  **Đặt mình vào vị trí người xuất khẩu để hiểu rủi ro và chi phí.**\n-   **Lời khuyên và chiến lược từ người hướng dẫn:** \"*thì các bạn sẽ nhớ lâu hơn của vi đi ô thì mình muốn tóm tác như thế này các đoạn cứ nhớ là một lô hàng sẽ có ba giai đoạn vận chuyển giai đoạn thứ nhất là thuộc nhóm tơm gì giai đoạn thứ hai tơm gì giai đoạn thứ ba tơm gì iai đoạn thứ nhất là giai đoạn vận chuyển nội địa là tơm ép giai đoạn thứ hai giai đoạn vận chuyển quốc tế là tơm xi giai đoạn thứ ba là giai đoạn vận chuyểnội đi ở đầu nước ngoài là tơm đi*\" [09:40-10:07]\n\n## 4. Tài liệu liên quan\n\nKhông có slide hoặc tài liệu tham khảo nào được cung cấp.\n"
          }
        },
        {
          "start_time": "2025-09-28T03:17:28.637618",
          "finished_at": "2025-09-28T03:18:11.191919",
          "type": 4,
          "status": "Success",
          "record_id": "1b44222a-07f5-406a-971f-26a179183138",
          "error_message": null,
          "extra": {}
        }
      ]
      setLastVersion(_lastestVersion);
      setValues({
        id: _record?.id,
        title: _record?.title,
        description: _record?.description,
        record_content_type: _record?.record_content_type,
        url: _record?.url || null,
        youtubeLink: null,
        attachments: _record?.attachments || [],
        emails: _record?.emails || [],
        lang: _record?.lang,
        source_type: _record?.source_type || SourceTypeEnum.YOUTUBE,
        thumnail_url: _record?.thumnail_url
      });
      validateForm();
      setRecord(_record);
      hideLoading();
    } catch (e) {
      console.log(e);
    } finally {
    }
  }

  const replace = (index, newAttachment, updatedAttachments) => {
    const newAttachments = updatedAttachments.map((item) => {
      if (item.idx === index) {
        return newAttachment;
      } else {
        return item;
      }
    })
    setFieldValue("attachments", newAttachments);
    return newAttachments;
  };

  const remove = (index) => {
    const updated = values.attachments.filter((_, i) => i !== index);
    setFieldValue("attachments", updated);
  };

  const handleUploadFile = (event) => {
    if (_.isEmpty(event.target.files)) return;
    const orginalIndex = values.attachments.length;
    const newFiles = _.map(event.target.files, (file, index) => ({
      filename: file.name,
      mime: file.type,
      size: file.size,
      url: null,
      originalFile: file,
      loading: true,
      state: "uploading",
      idx: orginalIndex + index
    }));
    var updatedAttachments = [...values.attachments, ...newFiles];
    setFieldValue('attachments', updatedAttachments);
    Array.from(newFiles).forEach((item) => {
      const { originalFile, idx } = item;
      uploadFile(originalFile)
        .then(({ data }) => {
          updatedAttachments = replace(idx, { ...data, loading: false, state: "success" }, updatedAttachments);
        })
        .catch((error) => {
          console.error(error);
          updatedAttachments = replace(idx, { ...updatedAttachments[idx], loading: false, state: "error" }, updatedAttachments);
        });
    });
  }

  useEffect(() => {
    getRecordDetail();
  }, [recordId]);

  useEffect(() => {
    showLoading();
  }, [])

  if (isLoading || !record) return null;
  return (
    <div className={styles.recordSettingPage}>
      <div className={styles.breadcums}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link className={styles.breadcumsItem} underline="hover" color="inherit" href="/"><HomeIcon sx={{ color: '#6B7280' }} size={20} /></Link>
          <Link className={styles.breadcumsItem} underline="hover" color="inherit" href={AppRoute.RECORDS}>Video tóm tắt</Link>
          <Link className={classNames(styles.breadcumsItem, styles.actived)} underline="hover" color="inherit" href="#">{record?.title}</Link>
        </Breadcrumbs>
      </div>
      <div className={styles.recordSettingPageInner}>
        <Scrollbars autoHide>
          <form onSubmit={handleSubmit}>
            <div className={styles.generalInfoLayout}>
              <div className={styles.formLayout}>
                <div className="flex flex-col">
                  <div className="flex flex-col gap-2">
                    <h5 className={styles.sectionTitle}>Thông tin video</h5>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel required shrink htmlFor="title">Tiêu đề</InputLabel>
                      <BootstrapInput {...getFieldProps("title")} size="small" sx={{ fontSize: "14px" }} fullWidth />
                      {touched.title && errors.title ? (
                        <div className="text-errorColor text-[12px] mt-[2px]">{errors.title}</div>
                      ) : (<div div className="text-textSecondaryColor text-[12px] mt-[2px]">
                        Give your product a short and clear title.
                        50-60 characters is the recommended length for search engines.
                      </div>)}
                    </FormControl>
                    <div className="flex gap-2">
                      <FormControl variant="standard" fullWidth >
                        <InputLabel shrink htmlFor="record_content_type" required size="small">Thể loại</InputLabel>
                        <BootstrapAutocomplete
                          {...getFieldProps("record_content_type")}
                          placeholder="Chọn thể loại"
                          value={RecordContentTypes.find(x => x?.id === values.record_content_type) || null}
                          options={RecordContentTypes || []}
                          getOptionKey={(option) => option.id}
                          getOptionLabel={(option) => option.label}
                          onChange={(e, value, reason) => setFieldValue('record_content_type', value?.id)}
                        />
                        {touched.record_content_type && errors.record_content_type && (
                          <div className="text-errorColor text-[12px] mt-[2px]">{errors.record_content_type}</div>
                        )}
                      </FormControl>
                      <FormControl variant="standard" fullWidth >
                        <InputLabel shrink htmlFor="lang" size="small" required>Ngôn ngữ</InputLabel>
                        <BootstrapAutocomplete
                          id="lang"
                          name="lang"
                          placeholder="Chọn ngôn ngữ"
                          value={VideoLanguages.find(x => x?.id === values.lang) || null}
                          options={VideoLanguages || []}
                          getOptionKey={(option) => option.id}
                          getOptionLabel={(option) => option.label}
                          onChange={(e, value, reason) => setFieldValue('lang', value.id)}
                        />
                        {touched.lang && errors.lang && (
                          <div className="text-errorColor text-[12px] mt-[2px]">{errors.lang}</div>
                        )}
                      </FormControl>
                    </div>
                    <div className="flex gap-2">
                      <FormControl variant="standard" fullWidth >
                        <InputLabel shrink htmlFor="lang" size="small" required>Nguồn video</InputLabel>
                        <BootstrapAutocomplete
                          {...getFieldProps("source_type")}
                          id="source_type"
                          name="source_type"
                          placeholder="Chọn nguồn video"
                          value={SourceTypes.find(x => x?.id === values.source_type) || null}
                          options={SourceTypes || []}
                          getOptionKey={(option) => option.id}
                          getOptionLabel={(option) => option.label}
                          onChange={(e, value, reason) => { setValues({ ...values, url: null, youtubeLink: null, source_type: value?.id || null }) }}
                        />
                        {touched.source_type && errors.source_type && (
                          <div className="text-errorColor text-[12px] mt-[2px]">{errors.source_type}</div>
                        )}
                      </FormControl>
                    </div>
                    <FormControl variant="standard" fullWidth sx={{ mt: '10px' }}>
                      <InputLabel shrink htmlFor="description">Mô tả</InputLabel>
                      <BootstrapInput
                        {...getFieldProps("description")}
                        as={BootstrapInput}
                        name="description"
                        id="description"
                        size="small"
                        placeholder="Nhập mô tả video"
                        multiline
                        rows={10}
                        sx={{
                          fontSize: "14px",
                          '& .MuiInputBase-input': {
                            borderRadius: '15px'
                          }
                        }}
                        fullWidth
                      />
                      {touched.description && errors.description && (<div className="text-errorColor text-[12px] mt-[2px]">{errors.description}</div>)}
                    </FormControl>
                  </div>
                  <FormControl variant="standard" fullWidth sx={{ mt: '10px' }}>
                    <InputLabel shrink htmlFor="lang" size="small">Chia sẻ đến</InputLabel>
                    <Autocomplete
                      {...getFieldProps("emails")}
                      id="emails"
                      sx={{ mt: '24px' }}
                      name="emails"
                      placeholder="Nhập email"
                      multiple
                      freeSolo
                      value={values.emails}
                      options={[]}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip label={option}  {...getTagProps({ index })}
                            onDelete={() => setFieldValue('emails', values.emails.filter((_, i) => i !== index))} />
                        ))
                      }
                      onChange={(e, value, reason) => setFieldValue('emails', value)}
                      renderInput={params => <TextField {...params} variant="outlined" placeholder="Nhập emails" />}
                    />
                    {touched.emails && errors.emails && (<div>{errors.emails}</div>)}
                  </FormControl>
                </div>
              </div>
              <div className={styles.videoPreview}>
                <div className="flex flex-col w-full">
                  <h5 className="font-[600] w-full mt-4">Video</h5>
                  <div className="text-textSecondaryColor text-[12px] mt-[2px] w-full">
                    Each objective must have <strong>at least 1</strong> key result to ensure progress can be tracked.
                    To maintain clarity and focus, limit each objective to <strong>no more than 5</strong> key results.
                  </div>
                  {!values.url
                    ? <div className="flex flex-col gap-2 w-full">
                      {values.source_type === 'local'
                        ? <div className={styles.mediaPlaceHolder} onClick={() => document.getElementById("media.input")?.click()}>
                          {videoUploading ? <CircularProgress /> : <OndemandVideoIcon />}
                          <div className={styles.title}>{videoUploading ? "Đang tải lên video" : "Tải lên video"}</div>
                          <div className={styles.helperText}>Video có dung lượng tối đa là 20mb.</div>
                        </div>
                        : <div className={styles.youtubePasteLink}>
                          <FormControl variant="standard" fullWidth sx={{ mt: '10px' }}>
                            <InputLabel shrink htmlFor="youtubeLink">Đường dẫn Youtube</InputLabel>
                            <BootstrapInput
                              {...getFieldProps("youtubeLink")}
                              startAdornment={<InputAdornment position="start"><YouTubeIcon sx={{ color: '#B2071D' }} /></InputAdornment>}
                              endAdornment={
                                <InputAdornment position="end">
                                  {youtubeChecking && <div className={styles.loadingContainer}><CircularProgress size='20px' /></div>}
                                  {!youtubeChecking && values.youtubeLink && !errors.youtubeLink && <CheckCircleIcon sx={{ color: colors.successColorBg }} />}
                                  {!youtubeChecking && errors.youtubeLink && <ErrorOutlineIcon sx={{ color: colors.errorColor }} />}
                                </InputAdornment>
                              }
                              onChange={(e) => {
                                setFieldValue('youtubeLink', e.target.value || null);
                                setYoutubeChecking(false);
                                if (!errors.youtubeLink) {
                                  handleCheckYoutube(e, setFieldValue, setFieldError)
                                    .then(() => setFieldValue("url", e.target.value))
                                    .catch(() => setFieldError("youtubeLink", "Không tìm thấy video"))
                                };
                              }}
                              name="youtubeLink"
                              id="youtubeLink"
                              size="small"
                              placeholder="Nhập đường dẫn Youtube"
                              fullWidth
                            />
                            {touched.youtubeLink && errors.youtubeLink && (
                              <div className="text-errorColor text-[12px] mt-[2px]">{errors.youtubeLink}</div>
                            )}
                          </FormControl>
                          {!_.isEmpty(values.youtubeLink) && !youtubeChecking && _.isEmpty(errors.youtubeLink) &&
                            <iframe
                              className={styles.ytbPreview}
                              title="Preview youtube"
                              src={getYoutubeEmbedUrl(values.youtubeLink)}
                              width="100%"
                              frameborder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowfullscreen >
                            </iframe>
                          }
                        </div>
                      }
                    </div>
                    : <div className={styles.videoPreview}>
                      <ReactPlayer ref={playerRef} width={"100%"} height={"100%"}
                        controls src={readS3Object(values?.url)} />
                    </div>
                  }
                </div>
                {values.source_type === 'local' &&
                  <div className="flex flex-col w-full mt-2">
                    <h5 className="font-[600] w-full mt-4">Hình thu nhỏ</h5>
                    <div className="text-textSecondaryColor text-[12px] mt-[2px] w-full">
                      Chọn hình thu nhỏ nổi bật để thu hút sự chú ý của người xem. <a className={styles.researchLink} href="/">Tìm hiểu thêm</a>
                    </div>
                    <div className={styles.thumbnailSelector}>
                      <div className={styles.thumbnailSelectorItem}>
                        <div className={styles.overlay}>
                          <AddPhotoAlternateOutlinedIcon />
                          Tải tệp lên
                        </div>
                      </div>
                      <div className={styles.thumbnailSelectorItem}>
                        <div className={styles.overlay}>
                          <AutoAwesomeOutlinedIcon />
                          Tạo tự động
                        </div>
                      </div>
                    </div>
                  </div>
                }
                <input id="media.input" type="file" accept="video/*" style={{ display: 'none' }}
                  onChange={(e) => handleUploadVideo(e, setFieldValue, setFieldError)} />
                <div className="flex flex-col w-full overflow-hidden mt-2">
                  <h5 className="font-[600] w-full mt-4">Tải lên tài liệu đính kèm</h5>
                  <div className="text-textSecondaryColor text-[12px] mt-[2px] w-full">
                    Each objective must have <strong>at least 1</strong> key result to ensure progress can be tracked.
                    To maintain clarity and focus, limit each objective to <strong>no more than 5</strong> key results.
                  </div>
                  <div className={styles.attachmentContainer}>
                    <div className={styles.attachments}>
                      {values.attachments.map((attachment, index) => {
                        const isTxt = attachment?.mime === "text/plain"
                        const isExcel = attachment?.mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        const isDocx = attachment?.mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || attachment?.mime === "application/msword";
                        const isPdf = attachment?.mime === "application/pdf";
                        return (
                          <div className={styles.attachmentItem} key={index}>
                            {isDocx && <IcMsWord />}
                            {isPdf && <IcPdf />}
                            {isExcel && <IcExcel />}
                            <div className="flex flex-col overflow-hidden w-full">
                              <div className={styles.titleWrapper}>
                                <Tooltip title={attachment?.filename}>
                                  <span className={styles.title}>{attachment?.filename}</span>
                                </Tooltip>
                              </div>
                              {isDocx && <div className={styles.mime}>{'application/docx'}</div>}
                              {isPdf && <div className={styles.mime}>{'application/pdf'}</div>}
                              {isExcel && <div className={styles.mime}>{'application/sheet'}</div>}
                            </div>
                            {attachment.loading &&
                              <div className={styles.loadingContainer}>
                                <CircularProgress size='20px' />
                              </div>
                            }
                            {(!attachment.loading && attachment.state === 'success') &&
                              <IconButton onClick={() => remove(index)}>
                                <DeleteOutlineIcon sx={{ color: colors.errorColor }} />
                              </IconButton>
                            }
                          </div>
                        );
                      })}
                      <Button variant="outlined" className="mt-4" type="button" onClick={() => { document.getElementById('media.attachments')?.click() }}>
                        Thêm tệp đính kèm
                      </Button>
                      <input
                        id="media.attachments" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                        style={{ display: 'none' }} onChange={handleUploadFile}>
                      </input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex gap-2 mr-[30px] mb-[30px] flex-1 justify-end'>
              <Button variant='outlined' size='medium'>Hủy</Button>
              <LoadingButton variant='contained' size='medium' loading={updating} type="submit"
                disabled={!hasDiff(record, values)
                  || _.some(values.attachments, item => item?.loading && item?.state === "uploading")
                  || !_.isEmpty(errors)} sx={{ width: '150px' }}>Cập nhật
              </LoadingButton>
            </div>
          </form>
        </Scrollbars>
        <div className={styles.workflowLayout}>
          <Stepper
            activeStep={2}
            //activeStep={PipelineSteps[record.current_step].index} 
            orientation='vertical'>
            {Object.values(PipelineItemTypeEnum)
              .filter((v) => typeof v === "number")
              .map((stepId) => {
                const step = PipelineSteps[stepId];
                const log = record.pipeline_items.find((l) => l.type === stepId);
                const completed = record.current_step === PipelineItemTypeEnum.CHATBOT_PREPARATION && log.status === 'Success';
                return (
                  <Step
                    key={stepId}
                    completed={completed}
                    disabled={!completed}
                    className={classNames(styles.stepItem, { [styles.stepItemfailed]: log?.status === "Failed", })} >
                    <StepLabel
                      optional={log
                        ? <span
                          className={classNames(styles.stepItemStatus, {
                            [styles.success]: log?.status === "Success",
                            [styles.failed]: log?.status === "Failed",
                            [styles.pending]: log?.status === "Pending",
                            [styles.running]: log?.status === "Running",
                            [styles.cancelled]: log?.status === "Cancelled",
                          })}
                        >
                          {StatusMapStrings[log.status] || log.status}
                        </span>
                        : undefined
                      }
                    >
                      {step.stepName}
                    </StepLabel>
                    <StepContent slotProps={{ transition: { unmountOnExit: false } }}>
                      {log.error_message
                        ? <div className={styles.stepItemErrorMsg}>{step.stepDescription}</div>
                        : <div className={styles.stepItemDescription}>{step.stepDescription}</div>
                      }
                      {(log.type === PipelineItemTypeEnum.GENERATE_SUM) &&
                        <div className={styles.previewLastSummaryButton}>
                          <div className='flex flex-col w-full overflow-hidden'>
                            <div className={styles.recordTitle}>{_.capitalize(record?.title)}</div>
                            <div className={styles.version}>Phiên bản {lastVersion?.title}<span> (Mới nhất)</span></div>
                          </div>
                          <div className='flex gap-1'>
                            <IconButton className={styles.iconBtn} onClick={() => { openPreviewDialog(lastVersion?.id) }}>
                              <Tooltip title="Xem trước"><SlideshowOutlinedIcon /></Tooltip>
                            </IconButton>
                            <Tooltip title="Xuất bản">
                              <IconButton className={styles.iconBtn} disabled={record?.summary_version?.id === lastVersion?.id}>
                                <PublishOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                      }
                      {log?.status === "Failed" &&
                        <div className='flex mt-3'>
                          <Button variant='outlined' size='medium'>Thử lại</Button>
                        </div>
                      }
                    </StepContent>
                  </Step>
                );
              })}
          </Stepper>
        </div>
      </div>
    </div>
  )
}

export default RecordSettingPage;
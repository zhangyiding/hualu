<?php
namespace Admin\Controller;
use Common\Lib\Upimg;
use Common\Lib\UpimgClass;
use Think\Controller;
use Common\Controller\BaseController;
class NewsController extends BaseController {
    public function index(){

        $m_news = new \Admin\Model\NewsModel();
        $news_type = array(
            '1'=>'集团新闻',
            '2'=>'行业新闻',
            '3'=>'学院新闻',
        );

        $where = array();
        if($this->params['news_type']){
            $where['type'] = $this->params['news_type'];
        }

        if($data = $m_news->getNewsList($where)){
            foreach($data as $k=>$v){
                $data[$k]['img'] = getImageBaseUrl($v['img']);
            }

            $this->assign('news_list',$data);
            $this->assign('news_type',$news_type);
        }


        $this->display();
    }


    /*
     * 新增新闻
     */
    public function addNews(){
        //当type为1时执行更新操作，为2时插入操作
        $m_news = new \Admin\Model\NewsModel();
        $type = $this->params['type'];
        if($type == 1){
            $id = $this->params['id'];
            $data = $m_news->getNewsInfo($id);
            $this->assign('data',$data);
        }
        $news_type = array(
            '1'=>'集团新闻',
            '2'=>'行业新闻',
            '3'=>'学院新闻',
        );

        $this->assign('news_type',$news_type);
        $this->assign('op_type',$type);

        $this->display();
    }


    /*
     * 新增新闻
     */
    public function doAddNews(){
        $op_type = $this->params['op_type'];

        if($img_path = $this->uploadImg('news')){
            $data['img'] = $img_path;
        }

        $data['title'] = $this->params['title'];
        $data['content'] = $this->params['content'];
        $data['type'] = $this->params['type'];
        $m_news = new \Admin\Model\NewsModel();

        if($op_type == 1){
            $news_id = $this->params['id'];
            $where = array('id'=>$news_id);

            $result = $m_news->updateNews($data,$where);
        }else{
            $data['add_time'] = time();
            $result = $m_news->doAddNews($data);

        }

        if($result!== false){
            $this->showMsg('操作成功','index',1);
        }else{
            $this->showMsg('操作失败');
        }
    }

    /*
     * 删除课程动作
     */
    public function delNews(){
        $op_type = $this->params['op_type'];
        if(!in_array($op_type,array('1','2'))){
            $this->showMsg('操作状态错误');
        }
        $where['id'] = $this->params['id'];
        $m_coures = new \Admin\Model\NewsModel();
        $status = ($op_type == '1')? '1':'0';
        if($m_coures->delNews($where,$status) !== false){
            $this->showMsg('操作成功','index',1);
        }else{
            $this->showMsg('操作失败，请重试');
        }
    }


    /**
     * @todo 图片上传
     */
    public function uploadImg($upload_dir) {

        //文件上传路径
        if(!is_dir($upload_dir)){
            mkdir($upload_dir);
        }

        if(!is_writeable($upload_dir)) {
            $this->showMsg("上传目录不可写");
        }


        $upimgObj = new Upimg($_FILES['uploadFile']);
        if ($upimgObj->Save($upload_dir,false)) {
            $imgUrl = $upimgObj->GetSavePath();
           return $imgUrl;
        } else {
           return false;
        }
    }



}
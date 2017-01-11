<?php
namespace Home\Controller;
use Common\Controller\BaseController;
use Home\Model\IndexModel;
use Think\Controller;
class IndexController extends BaseController {
    public function index(){
       $m_course = new \Home\Model\CourseModel();
        $area_list = $m_course->getCourseAreaArr();

        $news_type = C('news_t_list');

        $this->assign('area_list',$area_list);
        $this->assign('news_type',$news_type);
        $this->display();
    }

    //新闻列表
    public function newsList(){
        $news_type = $this->params['news_type'];
        $m_index = new \Home\Model\IndexModel();

        $news_list = $m_index->getNewsForType($news_type,$this->offset,$this->limit);

        foreach($news_list as $k=>$v){
            $news_list[$k]['img'] = getImageBaseUrl($v['img']);

        }

        $this->assign('news_list',$news_list);


        $this->display();
    }


    //新闻列表
    public function getNewsList(){
        $news_type = $this->params['news_type'];
        $m_index = new \Home\Model\IndexModel();

        if($count = $m_index->getNewsCount($news_type)){

            $news_list = $m_index->getNewsForType($news_type,$this->offset,$this->limit);

            foreach($news_list as $k=>$v){
                $news_list[$k]['img'] = getImageBaseUrl($v['img']);

            }

            $this->to_back(array('count'=>$count,'data'=>$news_list));
        }





    }

    public function newsInfo(){
        $news_id = $this->params['news_id'];
        $m_index = new IndexModel();
        if($news_info = $m_index->getNewsInfo($news_id)){
            $this->assign('news_info',$news_info);
        }
        $this->display();
    }




    public function header(){
        $this->display();
    }


    public function footer(){
        $this->display();
    }
}
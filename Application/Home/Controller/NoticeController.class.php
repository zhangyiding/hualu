<?php

/*
 * 学员须知
 *
 */
namespace Home\Controller;
use Admin\Model\CourseModel;
use Common\Controller\BaseController;
use Think\Controller;
class NoticeController extends BaseController {
    public function process(){
        $this->display();
    }

    /*
     * 先学习后付款
     */
    public function study(){
        $this->display();
    }


    /*
     * 学校地址
     */
    public function address(){
        $this->display();
    }


    /*
     * 学院环境
     */
    public function environment(){
        $this->display();
    }


    /*
     * 申请报名页面
     */
    public function signUp(){
        $m_course = new \Home\Model\CourseModel();
        $course_list = $m_course->getCourseList();

        $this->assign('cse_list',$course_list);

        $this->display();
    }


    /*
     * 申请报名动作
     */
    public function doSignUp(){
        $data['name'] = $this->params['name'];
        $data['mobile'] = $this->params['mobile'];
        $data['qq'] = $this->params['qq'];
        $data['gender'] = $this->params['gender'];
        $data['education'] = $this->params['education'];
        $data['Email'] = $this->params['Email'];
        $data['remark'] = $this->params['remark'];
        $data['is_ask'] = $this->params['is_ask'];
        $data['user_status'] = $this->params['user_status'];
        $data['learn_time'] =strtotime($this->params['learn_time']) ;
        $data['add_time'] = time();
        $data['course_id'] = $this->params['course_id'];


        $m_course = new \Home\Model\CourseModel();
        if($m_course->checkMobile($data['mobile'])){
            $this->showMsg('您已成功申请，请等待通知');
            exit;
        }



        if($m_course->doSignUp($data)){
            $this->showMsg('提交成功');
        }else{
            $this->showMsg('提交失败，请重试');
        }

    }



}
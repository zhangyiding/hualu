<?php
namespace Admin\Controller;
use Think\Controller;
use Common\Controller\BaseController;
class CourseController extends BaseController {

    /*
     * 管理报名信息
     */

    public function signUp()
    {

        $m_course = new \Admin\Model\CourseModel();
        if ($data = $m_course->getSignList()) {

            foreach ($data as $k => $v) {

                $cse_info = $m_course->getCourseInfo($v['course_id']);
                $data[$k]['cse_name'] = $cse_info['name'];

                $data[$k]['learn_time'] = date('m-d H:i', $v['learn_time']);
                $data[$k]['add_time'] = date('m-d H:i', $v['add_time']);

                $data[$k]['gender'] = ($v['gender'] == 1)? '男':'女';
                $data[$k]['is_ask'] = ($v['is_ask'] == 1)? '是':'否';
            }

            $this->assign('data', $data);
        }
        $this->display();
    }

    public function courseManage(){

        $m_course = new \Admin\Model\CourseModel();
        if($data = $m_course->getCourseList()){

            $this->assign('data',$data);
        }


        $this->display();
    }







}
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
        $where = array();
        if($is_handle = $this->params['is_handle']){
            $where['is_handle'] = $is_handle;
        }

        $m_course = new \Admin\Model\CourseModel();
        if ($data = $m_course->getSignList($where)) {

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

    /*
     * 课程管理
     */
    public function courseManage(){

        $m_course = new \Admin\Model\CourseModel();
        if($data = $m_course->getCourseList()){

            $this->assign('data',$data);
        }


        $this->display();
    }



    /*
     * 禁用弃用课程
     */
    public function delCourse(){
        $op_type = $this->params['op_type'];
        if(!in_array($op_type,array('1','2'))){
            $this->showMsg('操作状态错误');
        }
        $where['id'] = $this->params['id'];
        $m_coures = new \Admin\Model\CourseModel();
        $status = ($op_type == '1')? '1':'0';
        if($m_coures->delCourse($where,$status) !== false){
            $this->showMsg('操作成功','courseManage',1);
        }else{
            $this->showMsg('操作失败，请重试');
        }
    }



    /*
     * 新增课程
     */
    public function addCourse(){
        //当type为1时执行更新操作，为2时插入操作
        $m_course = new \Admin\Model\CourseModel();
        $type = $this->params['type'];
        if($type == 1){
            $id = $this->params['id'];
            $data = $m_course->getCourseInfo($id);
            $data['begin_time'] = date('Y-m-d H:i:s',$data['begin_time']);
            $this->assign('data',$data);
        }

        $this->assign('op_type',$type);

        $this->display();
    }


    /*
     * 新增新闻
     */
    public function doAddCourse(){
        $op_type = $this->params['op_type'];


        $data['name'] = $this->params['name'];
        $data['begin_time'] = strtotime($this->params['begin_time']);

        $m_course = new \Admin\Model\CourseModel();

        if($op_type == 1){
            $news_id = $this->params['id'];
            $where = array('id'=>$news_id);

            $result = $m_course->updateCourse($where,$data);
        }else{
            $data['add_time'] = time();
            $result = $m_course->doAddCourse($data);

        }

        if($result!== false){
            $this->showMsg('操作成功','courseManage',1);
        }else{
            $this->showMsg('操作失败');
        }
    }








    /*
     *处理申请信息
     */
    public function optionSignUp(){
//        $op_type = $this->params['id'];

        $where['id'] = $this->params['id'];
        $m_coures = new \Admin\Model\CourseModel();

        $data['is_handle'] = 1;
        if($m_coures->updateSign($where,$data) !== false){
            $this->showMsg('操作成功','signUp',1);
        }else{
            $this->showMsg('操作失败，请重试');
        }
    }







}
<?php
namespace Admin\Model;
use Think\Model;
use Common\Lib\Curl;
class CourseModel extends Model{
	protected $connection = 'DB_ETAGO';
    protected $tableName = 'hl_course';
	
	public function getCourseList(){
	    $result = $this->table('hl_course')->where()->select();
	    return $result;
	}

    public function getCourseInfo($id){
        $result = $this->table('hl_course')->where(array('id'=>$id))->find();
        return $result;
    }

    public function getAreInfo($id){
        $result = $this->table('hl_course_area')->where(array('id'=>$id))->select();
        return $result['0'];
    }


    public function getCourseAreaList(){
        $result = $this->table('hl_course_area')->where(array('del_flag'=>0))->select();
        return $result;
    }

    public function getCourseAreaArr(){
        $result = $this->table('hl_course_area')->where(array('del_flag'=>0))->select();
        $area_arr = array();
        foreach($result as $k=>$v){
            $area_arr[$v['id']] = $v['area_name'];
        }
        return $area_arr;
    }

    public function doAddCourse($where){
        $result = $this->table('hl_course')->add($where);
        return $result;
    }
    public function updateCourse($where,$data){
        $result = $this->table('hl_course')
            ->where($where)
            ->save($data);
        return $result;
    }

    public function doAddArea($where){
        $result = $this->table('hl_course_area')->add($where);
        return $result;
    }

    public function delCourse($where,$status){
        $data['del_flag'] = $status;
        $result = $this->table('hl_course')
            ->where($where)
            ->save($data);
        return $result;
    }



    public function getSignList($where){
        $where['del_flag'] = 0;
        $result = $this->table('hl_sign_up')
            ->where($where)
            ->select();
        return $result;
    }

    public function updateSign($where,$data){
        $result = $this->table('hl_sign_up')
            ->where($where)
            ->save($data);
        return $result;
    }

}
?>
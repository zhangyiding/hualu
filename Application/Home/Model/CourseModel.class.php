<?php
namespace Home\Model;
use Think\Model;
class CourseModel extends Model{

    protected $tableName = 'hl_course';
	
	public function getCourseList(){
        //当区域id为空时查询全部区域的数据
       $where = array('del_flag'=>0);
	    $result = $this->where($where)->select();
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


    public function doSignUp($data){
        $result = $this->table('hl_sign_up')
            ->add($data);

        return $result;
    }


    public function checkMobile($mobile){
        $result = $this->table('hl_sign_up')
            ->where(array('mobile'=>$mobile,'del_flag'=>0))
            ->select();
        return $result;
    }
}
?>
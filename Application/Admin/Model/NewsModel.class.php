<?php
namespace Admin\Model;
use Think\Model;
use Common\Lib\Curl;
class NewsModel extends Model{
	protected $connection = 'DB_ETAGO';
    protected $tableName = 'hl_news';
	
	public function getNewsList($where){
	    $result = $this->where($where)
            ->order('add_time desc ')
            ->select();
	    return $result;
	}

    public function getNewsInfo($id){
        $result = $this->table('hl_news')->where(array('id'=>$id))->select();
        return $result['0'];
    }



    public function doAddNews($data){
        $result = $this->table('hl_news')->add($data);
        return $result;
    }

    public function delNews($where,$status){
        $result = $this->table('hl_news')
            ->where($where)
            ->save(array('del_flag'=>$status));
        return $result;
    }

    public function updateNews($data,$where){
        $result = $this->table('hl_news')
            ->where($where)
            ->save($data);
        return $result;
    }


}
?>
<?php
namespace Home\Model;
use Think\Model;
class IndexModel extends Model{
	protected $connection = 'DB_ETAGO';
	
	public function getNewsForType($news_type){
        $where['del_flag'] = '0';
        $where['type'] = $news_type;
	    $result = $this->table('hl_news')
            ->where($where)
            ->order('rank desc')
            ->select();
	    return $result;
	}


    public function getNewsInfo($news_id){
        $where['del_flag'] = '0';
        $where['id'] = $news_id;
        $result = $this->table('hl_news')
            ->where($where)
            ->order('rank desc')
            ->find();
        return $result;
    }



}
?>
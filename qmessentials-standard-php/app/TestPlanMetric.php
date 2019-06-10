<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TestPlanMetric extends Model
{
    use SoftDeletes;

    public function testPlan() {
        return $this->belongsTo('App\TestPlan');
    }

    public function metric() {
        return $this->belongsTo('App\Metric');
    }

    public static function reconstructCriteria(float $min_value = NULL, boolean $is_min_value_inclusive = NULL, 
            float $max_value = NULL, boolean $is_max_value_inclusive = NULL) {
        if ($min_value != '') {
            if ($max_value != '') {
                if ($min_value == $max_value) {
                    return $min_value;
                }
                else {
                    return ($is_min_value_inclusive ? '[' : '(') . $min_value . '..' . $max_value . ($is_max_value_inclusive ? ']' : ')');
                }
            }            
            else {
                return '>' . ($is_min_value_inclusive ? '=' : '') . $min_value;
            }
        }
        else {
            if ($max_value != '') {
                return '<' . ($is_max_value_inclusive ? '=' : '') . $max_value;
            }
        }
        return '';
    }
}

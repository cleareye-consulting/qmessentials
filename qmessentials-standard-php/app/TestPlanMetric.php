<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TestPlanMetric extends Model
{
    use SoftDeletes;
    public $test_plan_id = 0;
    public $metric_id = 0;
    public $sort_order = 0;
    public $qualifier = '';
    public $unit = '';
    public $usage_code = '';
    public $is_nullable = false;
    public $min_value = 0.0;
    public $is_min_value_inclusive = false;
    public $max_value = 0.0;
    public $is_max_value_inclusive = false;   

    public function reconstructCriteria() {
        if ($this->min_value != '') {
            if ($this->max_value != '') {
                if ($this->min_value == $this->max_value) {
                    return $this->min_value;
                }
                else {
                    return ($this->is_min_value_inclusive ? '[' : '(') . $this->min_value . '..' . $this->max_value . ($this->is_max_value_inclusive ? ']' : ')');
                }
            }            
            else {
                return '>' . ($this->is_min_value_inclusive ? '=' : '') . $this->min_value;
            }
        }
        else {
            if ($this->max_value != '') {
                return '<' . ($this->is_max_value_inclusive ? '=' : '') . $this->max_value;
            }
        }
        return '';
    }
}

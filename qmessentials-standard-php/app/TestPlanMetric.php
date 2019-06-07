<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TestPlanMetric extends Model
{
    use SoftDeletes;

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

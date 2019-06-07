<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Observation extends Model
{
    public $test_run_id = 0;
    public $test_plan_metric_id = 0;
    public $min_value = 0.0;
    public $is_min_value_inclusive = false;
    public $max_value = 0.0;
    public $is_max_value_inclusive = false;
    public $is_nullable = false;
}

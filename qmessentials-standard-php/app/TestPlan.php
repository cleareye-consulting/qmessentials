<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TestPlan extends Model
{
    use SoftDeletes;
    public $test_plan_name = '';
}

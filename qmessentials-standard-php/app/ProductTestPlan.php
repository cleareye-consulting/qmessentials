<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProductTestPlan extends Model
{
    public $product_id = 0;
    public $test_plan_sequence_number = 0;
    public $test_plan_id = 0;
    public $is_required = false;
}

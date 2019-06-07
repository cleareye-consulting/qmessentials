<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MetricAvailableQualifier extends Model
{
    public $metric_id = 0;
    public $qualifier = '';
    public $sort_order = 0;
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTestPlanMetricsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('test_plan_metrics', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('test_plan_id')->unsigned();  
            $table->foreign('test_plan_id')->references('id')->on('test_plans');
            $table->bigInteger('metric_id')->unsigned();  
            $table->foreign('metric_id')->references('id')->on('metrics');
            $table->integer('sort_order');
            $table->string('qualifier', 100)->nullable();
            $table->string('unit', 100)->nullable();
            $table->double('min_value')->nullable();
            $table->boolean('is_min_value_inclusive')->nullable();
            $table->double('max_value')->nullable();
            $table->boolean('is_max_value_inclusive')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('test_plan_metrics');
    }
}

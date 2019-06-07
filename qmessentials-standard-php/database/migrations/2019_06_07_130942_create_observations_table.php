<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateObservationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('observations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->int('test_run_id');
            $table->foreign('test_run_id')->references('id')->on('test_runs');
            $table->int('test_plan_metric_id');
            $table->foreign('test_plan_metric_id')->references('id')->on('test_plan_metrics');
            $table->double('min_value')->nullable();
            $table->boolean('is_min_value_inclusive')->nullable();
            $table->double('max_value')->nullable();
            $table->boolean('is_max_value_inclusive')->nullable();
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
        Schema::dropIfExists('observations');
    }
}

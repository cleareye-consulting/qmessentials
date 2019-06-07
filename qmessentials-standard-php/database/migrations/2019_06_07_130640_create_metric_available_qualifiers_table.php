<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMetricAvailableQualifiersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('metric_available_qualifiers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('metric_id');
            $table->foreign('metric_id')->references('id')->on('metrics');
            $table->string('qualifier', 100);
            $table->int('sort_order');
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
        Schema::dropIfExists('metric_available_qualifiers');
    }
}

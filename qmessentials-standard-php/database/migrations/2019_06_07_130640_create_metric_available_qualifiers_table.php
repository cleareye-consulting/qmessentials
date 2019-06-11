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
            $table->bigInteger('metric_id')->unsigned();            
            $table->string('qualifier', 100);
            $table->integer('sort_order');
            $table->timestamps();
        });

        Schema::table('metric_available_qualifiers', function(Blueprint $table) {
            $table->foreign('metric_id')->references('id')->on('metrics');
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
